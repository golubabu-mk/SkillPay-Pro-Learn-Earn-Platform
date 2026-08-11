#![cfg(test)]

use super::*;
use soroban_sdk::testutils::{Address as _, BytesN as _, Ledger, LedgerInfo};
use soroban_sdk::Env;

fn setup() -> (Env, SkillPayRewardContractClient<'static>, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().set(LedgerInfo {
        timestamp: 1_000,
        protocol_version: 22,
        sequence_number: 10,
        network_id: Default::default(),
        base_reserve: 10,
        min_temp_entry_ttl: 16 * 60 * 60 * 24,
        min_persistent_entry_ttl: 16 * 60 * 60 * 24,
        max_entry_ttl: 365 * 16 * 60 * 60 * 24,
    });

    let contract_id = env.register(SkillPayRewardContract, ());
    let client = SkillPayRewardContractClient::new(&env, &contract_id);

    let organization = Address::generate(&env);
    let learner_a = Address::generate(&env);
    let learner_b = Address::generate(&env);

    (env, client, organization, learner_a, learner_b)
}

fn cid(env: &Env, seed: u8) -> BytesN<32> {
    let mut bytes = [0u8; 32];
    bytes[0] = seed;
    BytesN::from_array(env, &bytes)
}

#[test]
fn create_and_fetch_challenge() {
    let (env, client, org, _a, _b) = setup();
    let challenge_id = cid(&env, 1);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);

    let challenge = client.get_challenge(&challenge_id);
    assert_eq!(challenge.organization, org);
    assert_eq!(challenge.reward_pool, 1000);
    assert_eq!(challenge.remaining_pool, 1000);
    assert_eq!(challenge.max_winners, 3);
    assert_eq!(challenge.approved_count, 0);
    assert_eq!(challenge.status, ChallengeStatus::Active);
}

#[test]
fn cannot_create_duplicate_challenge() {
    let (env, client, org, _a, _b) = setup();
    let challenge_id = cid(&env, 1);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);
    let result = client.try_create_challenge(&challenge_id, &org, &500, &2, &2_000);

    assert_eq!(result, Err(Ok(Error::ChallengeAlreadyExists)));
}

#[test]
fn fund_challenge_increases_pool() {
    let (env, client, org, _a, _b) = setup();
    let challenge_id = cid(&env, 1);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);
    client.fund_challenge(&challenge_id, &org, &500);

    let challenge = client.get_challenge(&challenge_id);
    assert_eq!(challenge.reward_pool, 1500);
    assert_eq!(challenge.remaining_pool, 1500);
}

#[test]
fn only_organization_can_fund() {
    let (env, client, org, learner_a, _b) = setup();
    let challenge_id = cid(&env, 1);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);
    let result = client.try_fund_challenge(&challenge_id, &learner_a, &500);

    assert_eq!(result, Err(Ok(Error::NotOrganization)));
}

#[test]
fn approve_submission_deducts_pool_and_tracks_learner() {
    let (env, client, org, learner_a, _b) = setup();
    let challenge_id = cid(&env, 1);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);
    client.approve_submission(&challenge_id, &org, &learner_a, &300);

    let challenge = client.get_challenge(&challenge_id);
    assert_eq!(challenge.remaining_pool, 700);
    assert_eq!(challenge.approved_count, 1);
    assert!(client.is_learner_approved(&challenge_id, &learner_a));
}

#[test]
fn cannot_approve_same_learner_twice() {
    let (env, client, org, learner_a, _b) = setup();
    let challenge_id = cid(&env, 1);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);
    client.approve_submission(&challenge_id, &org, &learner_a, &300);

    let result = client.try_approve_submission(&challenge_id, &org, &learner_a, &200);
    assert_eq!(result, Err(Ok(Error::LearnerAlreadyApproved)));
}

#[test]
fn cannot_reward_more_than_remaining_pool() {
    let (env, client, org, learner_a, learner_b) = setup();
    let challenge_id = cid(&env, 1);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);
    client.approve_submission(&challenge_id, &org, &learner_a, &800);

    // only 200 left, requesting 300 should fail
    let result = client.try_approve_submission(&challenge_id, &org, &learner_b, &300);
    assert_eq!(result, Err(Ok(Error::RewardExceedsPool)));
}

#[test]
fn cannot_exceed_max_winners() {
    let (env, client, org, learner_a, learner_b) = setup();
    let challenge_id = cid(&env, 1);

    // max_winners = 1
    client.create_challenge(&challenge_id, &org, &1000, &1, &2_000);
    client.approve_submission(&challenge_id, &org, &learner_a, &100);

    let result = client.try_approve_submission(&challenge_id, &org, &learner_b, &100);
    assert_eq!(result, Err(Ok(Error::MaxWinnersReached)));
}

#[test]
fn cannot_approve_after_deadline() {
    let (env, client, org, learner_a, _b) = setup();
    let challenge_id = cid(&env, 1);

    // deadline of 1_500, current ledger time is 1_000
    client.create_challenge(&challenge_id, &org, &1000, &3, &1_500);

    env.ledger().set_timestamp(1_600);

    let result = client.try_approve_submission(&challenge_id, &org, &learner_a, &100);
    assert_eq!(result, Err(Ok(Error::DeadlinePassed)));
}

#[test]
fn cannot_approve_on_closed_challenge() {
    let (env, client, org, learner_a, _b) = setup();
    let challenge_id = cid(&env, 1);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);
    client.close_challenge(&challenge_id, &org);

    let result = client.try_approve_submission(&challenge_id, &org, &learner_a, &100);
    assert_eq!(result, Err(Ok(Error::ChallengeClosed)));
}

#[test]
fn issue_achievement_after_approval() {
    let (env, client, org, learner_a, _b) = setup();
    let challenge_id = cid(&env, 1);
    let credential_hash = cid(&env, 99);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);
    client.approve_submission(&challenge_id, &org, &learner_a, &300);
    client.issue_achievement(&challenge_id, &org, &learner_a, &credential_hash, &300);

    let achievement = client.get_achievement(&challenge_id, &learner_a);
    assert_eq!(achievement.learner, learner_a);
    assert_eq!(achievement.credential_hash, credential_hash);
    assert_eq!(achievement.reward_amount, 300);
}

#[test]
fn cannot_issue_achievement_without_approval() {
    let (env, client, org, learner_a, _b) = setup();
    let challenge_id = cid(&env, 1);
    let credential_hash = cid(&env, 99);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);

    let result =
        client.try_issue_achievement(&challenge_id, &org, &learner_a, &credential_hash, &300);
    assert_eq!(result, Err(Ok(Error::NotOrganization)));
}

#[test]
fn cannot_issue_duplicate_achievement() {
    let (env, client, org, learner_a, _b) = setup();
    let challenge_id = cid(&env, 1);
    let credential_hash = cid(&env, 99);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);
    client.approve_submission(&challenge_id, &org, &learner_a, &300);
    client.issue_achievement(&challenge_id, &org, &learner_a, &credential_hash, &300);

    let result =
        client.try_issue_achievement(&challenge_id, &org, &learner_a, &credential_hash, &300);
    assert_eq!(result, Err(Ok(Error::DuplicateAchievement)));
}

#[test]
fn close_challenge_updates_status() {
    let (env, client, org, _a, _b) = setup();
    let challenge_id = cid(&env, 1);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);
    client.close_challenge(&challenge_id, &org);

    let challenge = client.get_challenge(&challenge_id);
    assert_eq!(challenge.status, ChallengeStatus::Closed);
}

#[test]
fn only_organization_can_close() {
    let (env, client, org, learner_a, _b) = setup();
    let challenge_id = cid(&env, 1);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);
    let result = client.try_close_challenge(&challenge_id, &learner_a);

    assert_eq!(result, Err(Ok(Error::NotOrganization)));
}

#[test]
fn multiple_learners_can_be_rewarded_independently() {
    let (env, client, org, learner_a, learner_b) = setup();
    let challenge_id = cid(&env, 1);

    client.create_challenge(&challenge_id, &org, &1000, &3, &2_000);
    client.approve_submission(&challenge_id, &org, &learner_a, &400);
    client.approve_submission(&challenge_id, &org, &learner_b, &400);

    let challenge = client.get_challenge(&challenge_id);
    assert_eq!(challenge.remaining_pool, 200);
    assert_eq!(challenge.approved_count, 2);
}
