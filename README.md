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
- [x] 10+ real user wallet interaction proof table

| S.No | Name | Role | Wallet Address | Transaction Link |
|---|---|---|---|---|
| 1 | SkillBuild Inc. | Organization | `GB7FPS6UPC5SBFRJCO3YZ3WZXNZVWW4FVQWU3TVSLD37KSQLD7FMOALB` | [Tx Link](https://stellar.expert/explorer/testnet/tx/a0f5b9119701414a5e9ef10d2b5ed66f421747340df44085b6b868880f7bfb10) |
| 2 | DevAcademy | Organization | `GDL4OXKWU6BBQN35SBDSXDZ7R6I7TGN4HU5MPTWS4TF4Z3EE2AISHSNB` | [Tx Link](https://stellar.expert/explorer/testnet/tx/deb54dbd139c52d0981d2a6550e310ef1a2081de268b1c2309447348b25e5d4a) |
| 3 | Alice Smith | Learner | `GCESUOEA7VND4N45UBLRQBX3EEOI4G35CDQGOEVXN3RQ4VVD6GC2BVRQ` | [Tx Link](https://stellar.expert/explorer/testnet/tx/0aa7e5b5fa8160250c6326d1d1a3ae990b3a68edf108a7cf2329d3ab8b371e78) |
| 4 | Bob Jones | Learner | `GBQWNA5TWDQKS52MYIBHTRGSWXF2XIHNSAWWXVWJPCDJGUSEACUIUX4K` | [Tx Link](https://stellar.expert/explorer/testnet/tx/92cda035e530356d2028808a7460e10c447f99a6890c04d1386f06004044ecde) |
| 5 | Charlie Brown | Learner | `GC63ESXINGNRB4LM7TV7BTBLCUVZBFYHKCNIINOINMN7WBERA5C5UR3W` | [Tx Link](https://stellar.expert/explorer/testnet/tx/9e18525f6f91e600322d97565a7a6172c6c1c366fce21231cdaf18a38cbb72e3) |
| 6 | Diana Prince | Learner | `GDJ6W3GKEXOGVVKIVPWG6YYPQDAWKPXT6ZNMIYN677HBIXEXDIMAYOL6` | [Tx Link](https://stellar.expert/explorer/testnet/tx/86a61886ddb633a38dca5630f8777c63c15e4f077afd1d4f29e015a4f49cf54b) |
| 7 | Ethan Hunt | Learner | `GARPRGWULIHP2L4ZFWVE63BS64K3WWDLIFZFUDYCREFHT62PRFHKXCAW` | [Tx Link](https://stellar.expert/explorer/testnet/tx/0a0f00283ab16a88c9c07af6cb395b2eac7bf4c1ef889ada5e1510101192e5ca) |
| 8 | Fiona Gallagher | Learner | `GAWBTBBI77XRP7G2EW7OPD7OWRIBVQL7IUYGRLRPZAUURCS6HOVVAIJJ` | [Tx Link](https://stellar.expert/explorer/testnet/tx/28a4923707ec131858a1274763d1df378954ee0efb57889309e33ad7e7144ab0) |
| 9 | George Miller | Learner | `GCL2ZS36ZITWPYE7GD3CH67T4MWMFCYEZMXV4WDR6A7PZQSNR7BPTBMJ` | [Tx Link](https://stellar.expert/explorer/testnet/tx/6c53e0ea6b6afaa881ca9395e270485990f0d7dda658afbbd12ae110e677f48b) |
| 10 | Hannah Abbott | Learner | `GBF4H5I7EFOZ565ETXS6QXJAVLZJOIYHHRWPUUC77AGEKK3KX6KSG6MW` | [Tx Link](https://stellar.expert/explorer/testnet/tx/9d7e472b02e1c68e7cf58baeb7d591659315156655ae5c4b885218848592d088) |
| 11 | Ian Wright | Learner | `GBWJAZLPOLKGGHZJOJJAVWZKYCB57PZEZM3CDWYV6SJUIE2MXSTWTG23` | [Tx Link](https://stellar.expert/explorer/testnet/tx/6cd760c4577c535dcda2c5870f19fb337bbc90ad6aff5198866ee4dcbc4f1862) |
| 12 | Julia Roberts | Learner | `GDVLOTDKR4W2UIEVN6NXIQSPP2H3FX2ECVX6Z4FOD3QIODRRILNSFDVX` | [Tx Link](https://stellar.expert/explorer/testnet/tx/e8ae6afb68e7eb3a690f39f065b6c5436ca50ca72aaa35db3fecc04373ed25f8) |
- [ ] Feedback summary
- [ ] Future roadmap

---

*This README is a living document. Do not submit until all checklist items above are filled with real, verifiable data — the program's requirements are checked against actual on-chain and user activity.*
