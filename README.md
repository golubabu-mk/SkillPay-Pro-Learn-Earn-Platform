# SkillPay Pro — Learn, Earn & Achievement Platform

> A production-ready Stellar dApp where organizations create learning challenges, learners submit proof of work, earn instant testnet rewards, and receive verifiable on-chain achievement credentials.

**Status:** 🚧 Level 4 MVP build in progress

---

## Problem Statement

Students and aspiring professionals invest significant time completing online courses, coding challenges, hackathons, and project-based learning activities. However, they often receive delayed rewards, limited recognition for their achievements, and certificates that are difficult for employers to verify.

Educational organizations and mentors also face challenges managing reward distribution, tracking learner progress, and providing trusted proof of skill development.

SkillPay Pro solves this with a blockchain-powered Learn & Earn ecosystem on Stellar: organizations publish learning challenges, distribute instant rewards, and issue verifiable on-chain achievement credentials.

## Why Stellar

- Fast finality (~5s) and sub-cent fees make instant micro-rewards for learners economically viable
- Soroban smart contracts provide on-chain, tamper-proof achievement records
- Freighter wallet gives a standard, trust-minimized browser signing flow

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB Atlas |
| Wallet | Freighter |
| Blockchain | Stellar Testnet |
| Smart Contract | Soroban (Rust) |
| Analytics | PostHog |
| Monitoring | Sentry |
| Deployment | Vercel (frontend) + Render (backend) |

## Monorepo Structure

```
skillpay-pro/
 ├── frontend/     React app
 ├── backend/      Express API
 └── contracts/    Soroban reward contract
```

## Local Setup

See `frontend/.env.example` and `backend/.env.example` for required environment variables.

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev

# Contract
cd contracts/skillpay_reward_contract
stellar contract build
cargo test
```

## Features Implemented

- Wallet-based authentication (Freighter connect → sign nonce → verify → JWT), no passwords
- Organization challenge creation with real on-chain `create_challenge` + `fund_challenge` calls
- Challenge marketplace with category/difficulty filtering
- Learner submission flow (GitHub / live demo / video proof)
- Organization review dashboard: approve (triggers on-chain `approve_submission` + `issue_achievement`) or reject
- Public learner profile with verifiable on-chain achievement badges
- Admin dashboard: platform stats, organization verification queue
- Feedback collection
- PostHog analytics + Sentry monitoring integration points (add your own project keys)
- Soroban reward contract with 16 unit tests covering every access-control and accounting invariant

## Documentation Sections (fill in with real data before submitting)

- [ ] Architecture diagram
- [ ] Data flow diagram
- [ ] Smart contract flow
- [ ] Contract testnet address (after `stellar contract deploy`)
- [ ] Screenshots (product UI, mobile, analytics, monitoring)
- [ ] Demo video link
- [ ] 10+ real user wallet interaction proof table
- [ ] Feedback summary
- [ ] Future roadmap

---

*This README is a living document. Do not submit until all checklist items above are filled with real, verifiable data — the program's requirements are checked against actual on-chain and user activity.*
