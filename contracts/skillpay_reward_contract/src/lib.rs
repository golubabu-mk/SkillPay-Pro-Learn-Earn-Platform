#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, Address, BytesN, Env,
};

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ChallengeStatus {
    Active,
    Closed,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Challenge {
    pub organization: Address,
    pub reward_pool: i128,
    pub remaining_pool: i128,
    pub max_winners: u32,
    pub approved_count: u32,
    pub deadline: u64, // ledger timestamp (seconds)
    pub status: ChallengeStatus,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Achievement {
    pub learner: Address,
    pub challenge_id: BytesN<32>,
    pub credential_hash: BytesN<32>,
    pub reward_amount: i128,
    pub issued_at: u64,
}

/// Storage keys. Challenges and achievements are namespaced by (kind, id [, learner]).
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Challenge(BytesN<32>),
    Achievement(BytesN<32>, Address), // (challenge_id, learner)
    ApprovedLearner(BytesN<32>, Address), // dedupe guard for approvals
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    ChallengeAlreadyExists = 1,
    ChallengeNotFound = 2,
    ChallengeClosed = 3,
    DeadlinePassed = 4,
    NotOrganization = 5,
    RewardExceedsPool = 6,
    LearnerAlreadyApproved = 7,
    DuplicateAchievement = 8,
    AchievementNotFound = 9,
    InvalidAmount = 10,
    MaxWinnersReached = 11,
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone, Debug)]
pub struct ChallengeCreated {
    pub challenge_id: BytesN<32>,
    pub organization: Address,
    pub reward_pool: i128,
    pub max_winners: u32,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct ChallengeFunded {
    pub challenge_id: BytesN<32>,
    pub amount: i128,
    pub new_total_pool: i128,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct SubmissionApproved {
    pub challenge_id: BytesN<32>,
    pub learner: Address,
    pub reward_amount: i128,
    pub remaining_pool: i128,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct AchievementIssued {
    pub challenge_id: BytesN<32>,
    pub learner: Address,
    pub credential_hash: BytesN<32>,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct ChallengeClosedEvent {
    pub challenge_id: BytesN<32>,
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------

#[contract]
pub struct SkillPayRewardContract;

#[contractimpl]
impl SkillPayRewardContract {
    /// Create a new challenge. Caller must be the organization address, which
    /// must authorize this call (`organization.require_auth()`).
    pub fn create_challenge(
        env: Env,
        challenge_id: BytesN<32>,
        organization: Address,
        reward_pool: i128,
        max_winners: u32,
        deadline: u64,
    ) -> Result<(), Error> {
        organization.require_auth();

        if reward_pool <= 0 {
            return Err(Error::InvalidAmount);
        }

        let key = DataKey::Challenge(challenge_id.clone());
        if env.storage().persistent().has(&key) {
            return Err(Error::ChallengeAlreadyExists);
        }

        let challenge = Challenge {
            organization: organization.clone(),
            reward_pool,
            remaining_pool: reward_pool,
            max_winners,
            approved_count: 0,
            deadline,
            status: ChallengeStatus::Active,
        };

        env.storage().persistent().set(&key, &challenge);

        env.events().publish((soroban_sdk::symbol_short!("Created"), challenge_id.clone()), (organization, reward_pool, max_winners));

        Ok(())
    }

    /// Top up an existing challenge's reward pool. Only the owning
    /// organization may fund it.
    pub fn fund_challenge(
        env: Env,
        challenge_id: BytesN<32>,
        organization: Address,
        amount: i128,
    ) -> Result<(), Error> {
        organization.require_auth();

        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let key = DataKey::Challenge(challenge_id.clone());
        let mut challenge: Challenge = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(Error::ChallengeNotFound)?;

        if challenge.organization != organization {
            return Err(Error::NotOrganization);
        }
        if challenge.status != ChallengeStatus::Active {
            return Err(Error::ChallengeClosed);
        }

        challenge.reward_pool += amount;
        challenge.remaining_pool += amount;

        env.storage().persistent().set(&key, &challenge);

        env.events().publish((soroban_sdk::symbol_short!("Funded"), challenge_id.clone()), (amount, challenge.reward_pool));

        Ok(())
    }

    /// Approve a learner's submission and record the reward. Only the
    /// organization that owns the challenge can call this. Enforces:
    /// - challenge is active and before its deadline
    /// - reward does not exceed the remaining pool
    /// - a learner cannot be approved twice for the same challenge
    /// - max_winners is not exceeded
    pub fn approve_submission(
        env: Env,
        challenge_id: BytesN<32>,
        organization: Address,
        learner: Address,
        reward_amount: i128,
    ) -> Result<(), Error> {
        organization.require_auth();

        if reward_amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let key = DataKey::Challenge(challenge_id.clone());
        let mut challenge: Challenge = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(Error::ChallengeNotFound)?;

        if challenge.organization != organization {
            return Err(Error::NotOrganization);
        }
        if challenge.status != ChallengeStatus::Active {
            return Err(Error::ChallengeClosed);
        }
        if env.ledger().timestamp() > challenge.deadline {
            return Err(Error::DeadlinePassed);
        }
        if challenge.approved_count >= challenge.max_winners {
            return Err(Error::MaxWinnersReached);
        }
        if reward_amount > challenge.remaining_pool {
            return Err(Error::RewardExceedsPool);
        }

        let approved_key = DataKey::ApprovedLearner(challenge_id.clone(), learner.clone());
        if env.storage().persistent().has(&approved_key) {
            return Err(Error::LearnerAlreadyApproved);
        }

        challenge.remaining_pool -= reward_amount;
        challenge.approved_count += 1;

        env.storage().persistent().set(&key, &challenge);
        env.storage().persistent().set(&approved_key, &true);

        env.events().publish((soroban_sdk::symbol_short!("Approved"), challenge_id.clone(), learner.clone()), (reward_amount, challenge.remaining_pool));

        Ok(())
    }

    /// Issue an on-chain achievement credential for a learner who was
    /// approved on a challenge. Prevents duplicate issuance for the same
    /// (challenge, learner) pair.
    pub fn issue_achievement(
        env: Env,
        challenge_id: BytesN<32>,
        organization: Address,
        learner: Address,
        credential_hash: BytesN<32>,
        reward_amount: i128,
    ) -> Result<(), Error> {
        organization.require_auth();

        let ckey = DataKey::Challenge(challenge_id.clone());
        let challenge: Challenge = env
            .storage()
            .persistent()
            .get(&ckey)
            .ok_or(Error::ChallengeNotFound)?;

        if challenge.organization != organization {
            return Err(Error::NotOrganization);
        }

        // Learner must have been approved first — this also guarantees the
        // reward accounting already happened via approve_submission.
        let approved_key = DataKey::ApprovedLearner(challenge_id.clone(), learner.clone());
        if !env.storage().persistent().has(&approved_key) {
            return Err(Error::NotOrganization);
        }

        let akey = DataKey::Achievement(challenge_id.clone(), learner.clone());
        if env.storage().persistent().has(&akey) {
            return Err(Error::DuplicateAchievement);
        }

        let achievement = Achievement {
            learner: learner.clone(),
            challenge_id: challenge_id.clone(),
            credential_hash: credential_hash.clone(),
            reward_amount,
            issued_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&akey, &achievement);

        env.events().publish((soroban_sdk::symbol_short!("Issued"), challenge_id.clone(), learner.clone()), credential_hash);

        Ok(())
    }

    /// Close a challenge. Only the owning organization can close it. Once
    /// closed, no further approvals or achievement issuance can occur.
    pub fn close_challenge(
        env: Env,
        challenge_id: BytesN<32>,
        organization: Address,
    ) -> Result<(), Error> {
        organization.require_auth();

        let key = DataKey::Challenge(challenge_id.clone());
        let mut challenge: Challenge = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(Error::ChallengeNotFound)?;

        if challenge.organization != organization {
            return Err(Error::NotOrganization);
        }

        challenge.status = ChallengeStatus::Closed;
        env.storage().persistent().set(&key, &challenge);

        env.events().publish((soroban_sdk::symbol_short!("Closed"), challenge_id.clone()), ());

        Ok(())
    }

    /// Read-only: fetch a challenge's on-chain state.
    pub fn get_challenge(env: Env, challenge_id: BytesN<32>) -> Result<Challenge, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Challenge(challenge_id))
            .ok_or(Error::ChallengeNotFound)
    }

    /// Read-only: fetch an issued achievement for a learner + challenge.
    pub fn get_achievement(
        env: Env,
        challenge_id: BytesN<32>,
        learner: Address,
    ) -> Result<Achievement, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Achievement(challenge_id, learner))
            .ok_or(Error::AchievementNotFound)
    }

    /// Read-only helper: has this learner already been approved on this challenge?
    pub fn is_learner_approved(env: Env, challenge_id: BytesN<32>, learner: Address) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::ApprovedLearner(challenge_id, learner))
    }
}

mod test;
