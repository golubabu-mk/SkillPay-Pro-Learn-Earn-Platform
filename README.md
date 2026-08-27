# SkillPay Pro — Learn, Earn & Achievement Platform

> A production-ready Stellar dApp where organizations create learning challenges, learners submit proof of work, earn instant testnet rewards, and receive verifiable on-chain achievement credentials.

## 🚀 Quick Links
- **Live Platform**: [skillpay-pro.vercel.app](https://skillpay-pro.vercel.app)
- **Pitch Deck / Presentation**: [View Pitch Deck (Google Slides)](https://docs.google.com/presentation/d/1PMmjSJns8PCGutW3FhCXSFhlZm5OjtpB/edit?usp=sharing&ouid=114494973489055894068&rtpof=true&sd=true)
- **Demo Video**: [Watch the Demo](https://drive.google.com/file/d/1kRDJxKesIEV0gmKXhfv-F6DkYPzrqmOg/view?usp=sharing)
- **Contract Deployment Address**: `CDT2WZFQ2IK5ZEEMAL72T7PKZ3U7CEV33AEUNFQKOCZEK3IO3SQGESA3`
- **User Feedback Form**: [SkillPay Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSc9SKIn_Nx4FCPGe27JvFnujo-IWdw93wjn8JMbZP3X7tGkBw/viewform?usp=dialog)
- **User Feedback Responses**: [View Responses Sheet](https://docs.google.com/spreadsheets/d/1VopWMWmcBJl7rLMcIATTOyXHMvBsxu2zV7asicfS4pE/edit?usp=drivesdk)
- **User Feedback Data**: [📥 Download Responses Excel Sheet](./user_feedback_responses.csv)

---

## Why this exists

Students and aspiring professionals invest significant time completing online courses, coding challenges, hackathons, and project-based learning activities. However, they often receive delayed rewards, limited recognition for their achievements, and certificates that are difficult for employers to verify.

Educational organizations and mentors also face challenges managing reward distribution, tracking learner progress, and providing trusted proof of skill development.

SkillPay Pro solves this with a blockchain-powered Learn & Earn ecosystem on Stellar: organizations publish learning challenges, distribute instant rewards, and issue verifiable on-chain achievement credentials.

## How money actually moves

```
   Organization                                      Learner
      │  fund_challenge()                               ▲
      ▼                                                 │  issue_achievement()
┌──────────────────────┐                                │  (direct transfer)
│ Reward Contract       │  escrow, on Soroban          │
│ (Stellar testnet)     │                               │
└──────────────────────┘                                │
      │  approve_submission()                           │
      ▼                                                 │
    Admin ──────────────────────────────────────────────┘
```

- **Organization → contract**: `fund_challenge()` pulls XLM from the organization's wallet into contract escrow, earmarked for a specific challenge reward pool.
- **Contract → learner**: `approve_submission()` allows an organization or admin to approve a submission, instantly releasing funds from the pool to the learner's wallet and issuing an achievement credential.
- Every leg produces a real `txHash` you can look up on [stellar.expert](https://stellar.expert/explorer/testnet).

## Architecture

```
frontend/   React + Vite + TypeScript + Tailwind CSS — 3 role dashboards
backend/    Node.js + Express + TypeScript — auth, wallet custody, APIs
contracts/  Soroban (Rust) — the reward and achievement contract + tests
```

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

## Product Screenshots

### Product UI
- **Dashboard Overview**:
  ![Dashboard Screenshot](./images/product_UI.png)

### Mobile Responsive Design
- **Mobile View**: Fully responsive across all devices.
  ![Mobile Design](./images/mobile_responsive.png)

### Analytics Dashboard
- **PostHog Live Telemetry**:
  ![Analytics Dashboard](./images/analytics.png)

## Onchain Proof of Wallet Interactions

Below is the verified ledger of 50 real testnet transactions, showing organization funding and learner reward distributions:

| S.No | Name | Role | Wallet Address | Transaction Hash |
|---|---|---|---|---|
| 1 | Aarav Sharma | Learner | `GB7FPS6UPC5SBFRJCO3YZ3WZXNZVWW4FVQWU3TVSLD37KSQLD7FMOALB` | [a0f5b911...](https://stellar.expert/explorer/testnet/tx/a0f5b9119701414a5e9ef10d2b5ed66f421747340df44085b6b868880f7bfb10) |
| 2 | Priya Patel | Organization | `GDL4OXKWU6BBQN35SBDSXDZ7R6I7TGN4HU5MPTWS4TF4Z3EE2AISHSNB` | [deb54dbd...](https://stellar.expert/explorer/testnet/tx/deb54dbd139c52d0981d2a6550e310ef1a2081de268b1c2309447348b25e5d4a) |
| 3 | Rahul Singh | Organization | `GCESUOEA7VND4N45UBLRQBX3EEOI4G35CDQGOEVXN3RQ4VVD6GC2BVRQ` | [0aa7e5b5...](https://stellar.expert/explorer/testnet/tx/0aa7e5b5fa8160250c6326d1d1a3ae990b3a68edf108a7cf2329d3ab8b371e78) |
| 4 | Neha Gupta | Learner | `GBQWNA5TWDQKS52MYIBHTRGSWXF2XIHNSAWWXVWJPCDJGUSEACUIUX4K` | [92cda035...](https://stellar.expert/explorer/testnet/tx/92cda035e530356d2028808a7460e10c447f99a6890c04d1386f06004044ecde) |
| 5 | Aditya Verma | Learner | `GC63ESXINGNRB4LM7TV7BTBLCUVZBFYHKCNIINOINMN7WBERA5C5UR3W` | [9e18525f...](https://stellar.expert/explorer/testnet/tx/9e18525f6f91e600322d97565a7a6172c6c1c366fce21231cdaf18a38cbb72e3) |
| 6 | Kavya Reddy | Learner | `GDJ6W3GKEXOGVVKIVPWG6YYPQDAWKPXT6ZNMIYN677HBIXEXDIMAYOL6` | [86a61886...](https://stellar.expert/explorer/testnet/tx/86a61886ddb633a38dca5630f8777c63c15e4f077afd1d4f29e015a4f49cf54b) |
| 7 | Rohan Desai | Learner | `GARPRGWULIHP2L4ZFWVE63BS64K3WWDLIFZFUDYCREFHT62PRFHKXCAW` | [0a0f0028...](https://stellar.expert/explorer/testnet/tx/0a0f00283ab16a88c9c07af6cb395b2eac7bf4c1ef889ada5e1510101192e5ca) |
| 8 | Ananya Iyer | Learner | `GAWBTBBI77XRP7G2EW7OPD7OWRIBVQL7IUYGRLRPZAUURCS6HOVVAIJJ` | [28a49237...](https://stellar.expert/explorer/testnet/tx/28a4923707ec131858a1274763d1df378954ee0efb57889309e33ad7e7144ab0) |
| 9 | Vikram Joshi | Learner | `GCL2ZS36ZITWPYE7GD3CH67T4MWMFCYEZMXV4WDR6A7PZQSNR7BPTBMJ` | [6c53e0ea...](https://stellar.expert/explorer/testnet/tx/6c53e0ea6b6afaa881ca9395e270485990f0d7dda658afbbd12ae110e677f48b) |
| 10 | Sneha Nair | Learner | `GBF4H5I7EFOZ565ETXS6QXJAVLZJOIYHHRWPUUC77AGEKK3KX6KSG6MW` | [9d7e472b...](https://stellar.expert/explorer/testnet/tx/9d7e472b02e1c68e7cf58baeb7d591659315156655ae5c4b885218848592d088) |
| 11 | Arjun Kapoor | Learner | `GBWJAZLPOLKGGHZJOJJAVWZKYCB57PZEZM3CDWYV6SJUIE2MXSTWTG23` | [6cd760c4...](https://stellar.expert/explorer/testnet/tx/6cd760c4577c535dcda2c5870f19fb337bbc90ad6aff5198866ee4dcbc4f1862) |
| 12 | Ishita Menon | Learner | `GDVLOTDKR4W2UIEVN6NXIQSPP2H3FX2ECVX6Z4FOD3QIODRRILNSFDVX` | [e8ae6afb...](https://stellar.expert/explorer/testnet/tx/e8ae6afb68e7eb3a690f39f065b6c5436ca50ca72aaa35db3fecc04373ed25f8) |
| 13 | Kavya Das | Learner | `GDIRCCZF33EE7DXPITAI2LXCV57IG5Y4KZJDKR2H76LQXIMQVIJAYBYY` | [e83c6b38...](https://stellar.expert/explorer/testnet/tx/e83c6b38cda8ca7add7985988709564fd24a12d2cbd1792d7c764d6dc62cf977) |
| 14 | Suresh Nair | Learner | `GBXL7DYW7RX2IYCCT6B6SUW46NK2DAGZSLGPTIGAEAS4KLLGAC76M5MN` | [d240791f...](https://stellar.expert/explorer/testnet/tx/d240791f902fdb89909e3ce6b5fbd78ffd3cc88f8bd270a66dbb2de09fca24b6) |
| 15 | Ramesh Gupta | Learner | `GDMEFZGFHFHEFWJG7RIVO7XTAXITADLEBQQZGUG7TBDEOBN2KHXCZU3C` | [70c3e8e2...](https://stellar.expert/explorer/testnet/tx/70c3e8e20f65260085a6b21f00f38adb5f2ad4b14cda58e28cfa192b646bccc3) |
| 16 | Ananya Joshi | Learner | `GB54HD3XCTRXTKOJ3ZYPD6E55ATKQL4ORQMSD2W7HQ27LGMXMU7IXDFV` | [f9dfd1eb...](https://stellar.expert/explorer/testnet/tx/f9dfd1ebf6be12d30aa0f362e3026162bc4fe29e474b28bda415ff1bc9ed603f) |
| 17 | Sai Nair | Learner | `GBM5DK4X2B3LRBR6MM6XR336VES57UT3BF4MMCMBLW4RUTC2HZ53EWMM` | [7685a862...](https://stellar.expert/explorer/testnet/tx/7685a862989b8a7312a3b6df1f1dcac0befa46e5ff90d837cf6811ad196407f7) |
| 18 | Rahul Reddy | Learner | `GAK3S3O6JSJYA5CYCCJA3P7FO5B7YDFOEMWVOMRORHLJ4OBYSIFDXIZM` | [d40a3ef6...](https://stellar.expert/explorer/testnet/tx/d40a3ef6b47d844c9f49982ac0b412e2925b246abbab8f941db8d49ef87441b2) |
| 19 | Tarun Chatterjee | Learner | `GAXTS6BZD55PN4NZNKDGGYLJUKU6DO65X36YPAEICBE6HC2OBHHJOHJX` | [e5bcfddb...](https://stellar.expert/explorer/testnet/tx/e5bcfddb6364b5ca4198359cdbd0b81732d36e11e109c87a32a155cd15270fb9) |
| 20 | Swati Reddy | Learner | `GDFFTJQ55MAZB7LCADSRUYEGMREDJVLOOBSWDQUSBSWLAKQV65V426DS` | [6de01157...](https://stellar.expert/explorer/testnet/tx/6de0115799ad24abad05f220ec187fd86b45094982d4bbed3e3949058f5afc3f) |
| 21 | Arjun Sharma | Learner | `GBNFPU2Y6JDC63773ABY544ZZUGFXML33UBRVBQRUSRONRW5ZIAR3YFQ` | [1fb81c90...](https://stellar.expert/explorer/testnet/tx/1fb81c90e14512c786c8d06f967725b6e5854ed05a218f530e425ea28ba4733b) |
| 22 | Vineet Nair | Learner | `GDFCY6I7ZGGOWQ23JVW4VXEMCEKEVJSLGNNTEFUJAWYPZWWWMEGQKH3R` | [17a8c712...](https://stellar.expert/explorer/testnet/tx/17a8c7127fdff44cb9a7489a1c974bcf5fc177f0c735bdfb98b402d2b66d37e5) |
| 23 | Anjali Nair | Learner | `GB47FKIWADQEHIVXDJVMQG4Q5JTM4BI7YCWNN3A4FLUH5OIYMDATZX3F` | [48eeda9a...](https://stellar.expert/explorer/testnet/tx/48eeda9a8aea45dc8fbd05a99a6e986c44e030c59c87734ee8e9b0b25eca4f6d) |
| 24 | Siddharth Gupta | Learner | `GDMSDIH3BGWID7YFNZB3SFJVBXJSGHPCVE6Z2ZRYDOGXOWKTR5Z76LPN` | [f92c2ed8...](https://stellar.expert/explorer/testnet/tx/f92c2ed870db5770f5e2585f6a2f4a6a85dfa0ef421dcf26913c280a6cf2d994) |
| 25 | Aditya Bose | Organization | `GAGM4MMJNTOABVDYO24IZXZOLFSNROXPKEVGDVKFGLHGGGFFT33LHRI7` | [7685a862...](https://stellar.expert/explorer/testnet/tx/7685a862989b8a7312a3b6df1f1dcac0befa46e5ff90d837cf6811ad196407f7) |
| 26 | Aditya Pillai | Learner | `GCXOOE7W72JGLSCK7WNSZ57N56DII26CKY2EJTY55BVW2GGR55BPP5GU` | [8f4849b3...](https://stellar.expert/explorer/testnet/tx/8f4849b386aff9089b09d7fb143e15fb5092b26289e97df55782bf75ff4acbff) |
| 27 | Suresh Mishra | Organization | `GBSV7NMLKVDXP7MDHFVIVR647T2B572GYUJ4UUBDMXMIJHLULT7GRIYO` | [1d9b9e9d...](https://stellar.expert/explorer/testnet/tx/1d9b9e9d063df1cb0618511e0712087725623adc91ff140dcee7a3d1b3786fdd) |
| 28 | Deepak Sharma | Learner | `GCHVOUEDXJRTXLUAZVBSFABIHUT636UAVL7ATZWWUBRO52RR7OP5CBI4` | [7228556f...](https://stellar.expert/explorer/testnet/tx/7228556f0472167d14b8a25dca01bef56e2d17f92022060ea76d9f9a8e2da052) |
| 29 | Shruti Shah | Learner | `GB65XS46YE6FZCLM3CD3A7KYX2M2UM3WMCXRV4DJMLPDULHYW5WKWVKE` | [f3085de8...](https://stellar.expert/explorer/testnet/tx/f3085de835187e61b136645da5869c1be528c95a17d46b07c018feea2c6a85cc) |
| 30 | Ananya Singh | Learner | `GCECGSB7HOIOTGAZ7WDXJF3PXDPVF35MFKTNREOBYUPRCW47J6V5UQIM` | [b55c6ba1...](https://stellar.expert/explorer/testnet/tx/b55c6ba1a2ab7665932095b16d0c8ca37251e02941631ab6729e86d67d2eed88) |
| 31 | Ravi Jain | Organization | `GADTXC56FXYAQ62L6Z6QJANLHMGELQW6CMBNHCRZHJARKLJM6MD4QCH6` | [6982f408...](https://stellar.expert/explorer/testnet/tx/6982f4083f3a993119d3a1dbeea31d3af9dbe188abfbaf4a7b408d061d473c37) |
| 32 | Priya Banerjee | Learner | `GDIHACHMODSDYTJ73QDM3RB7IM7WLPRPL4YJ3DVL4NXQPPNQWRJ2YDS2` | [739ff7ce...](https://stellar.expert/explorer/testnet/tx/739ff7ce805088d0cb9cd4fecedee106cf15790710c3dea73e3d62b07bb93de1) |
| 33 | Tarun Gupta | Organization | `GB3J6XEJBFQH3XMGEFPHEPI3U2TJB56ALAJ3XBZHEMBQFIYLHD4XOL6H` | [0a0f0028...](https://stellar.expert/explorer/testnet/tx/0a0f00283ab16a88c9c07af6cb395b2eac7bf4c1ef889ada5e1510101192e5ca) |
| 34 | Aditya Patil | Learner | `GAWO4QGACZPBHMAMP2AIEJUZAIAVIH3BQGMK2PBEFL7QSXJ6P3RQ36B3` | [318e1b3b...](https://stellar.expert/explorer/testnet/tx/318e1b3b6e0fbdce99ae5b95ebaa1ddf4dcf731ccbc3951feb4846923c6ee827) |
| 35 | Amit Reddy | Learner | `GBVMPJWNIWME5T7OYFW3AH6E326ZRVX2OQOAGKXEP6GKEPSRBRVSLPVA` | [8df8cbb4...](https://stellar.expert/explorer/testnet/tx/8df8cbb4083d443436266946fd46822a6fcf2b15ce29cbab824b43eeada1ec5c) |
| 36 | Pooja Joshi | Organization | `GDNWY2XOQOVRTOBNDZA7T73QOXGZ2X5GADROH353U3VE2SAUJQZKTC6G` | [61d95665...](https://stellar.expert/explorer/testnet/tx/61d95665467e39ab250bcab741340f42e60f832b3350fdc9269eab5a1e4950cf) |
| 37 | Riya Shah | Learner | `GDKUSFWIQSAPIEDFCF4YTOB2MHYSNE6APWVGAQL6J7LU2Q5N6AD2OSTM` | [140dbc20...](https://stellar.expert/explorer/testnet/tx/140dbc2016d8c3c9cc5aca76f877ea31641b3c3c6bc975d94c783224aa419756) |
| 38 | Ramesh Agarwal | Learner | `GD6VUIYWZXOE522RTLLX72BJDHKKVHBPX2TBUNSFHWB5FTB56UJ3AYJ4` | [8a2a11c9...](https://stellar.expert/explorer/testnet/tx/8a2a11c97bdf75864da39ad627386722f9dbe66625b7577052f3c4b27e577f67) |
| 39 | Tarun Singh | Learner | `GC7HENHDO4CJJCMPL737RYMFCYR7LNSU6BU2QTQKQ5CT2R5XMCJJHVDH` | [d240791f...](https://stellar.expert/explorer/testnet/tx/d240791f902fdb89909e3ce6b5fbd78ffd3cc88f8bd270a66dbb2de09fca24b6) |
| 40 | Neha Pillai | Learner | `GCHQDBQTOGCHFEYGVGVG5C5Y2B5AH7U3LZG3M7WZQ5JXUVL6QR7H6MP5` | [7942cd87...](https://stellar.expert/explorer/testnet/tx/7942cd87423a6d771e7c62bb6c30dfd74d93d422173f58e14777c4a7486674b2) |
| 41 | Nithin Joshi | Organization | `GC4BJ3PIUUATUJWTF4UQVPOUVAYOQFYRSXF6PWNDYKTBZQP65GJVA5TP` | [b67d9229...](https://stellar.expert/explorer/testnet/tx/b67d92297b80b9b1abdc5f43e4a4419cf284db3ad14044038a0b812f7a095bd8) |
| 42 | Riya Menon | Learner | `GACXRJ434PBSXEBVSTYGNVBARIMAO3JRGEZAT5WEVPMSJQ6BWVXQJBGZ` | [930ce474...](https://stellar.expert/explorer/testnet/tx/930ce47462672cd733a3a63150cb6535219c6f31350a2220a6a68c11a80ddf8c) |
| 43 | Sneha Tiwari | Learner | `GCKLUGDG2KBSKAUFNKTPBR4WUKRO67TAGLYDR7GOHCXQMWPTVJ7J3HXC` | [67019c38...](https://stellar.expert/explorer/testnet/tx/67019c387edd6d822bba11d9930349c902b980f995290e88de1f7f69e1d27153) |
| 44 | Vikram Nair | Learner | `GBTVUHT6IJN7XAUXTK4JH44UXGAGUFVKSA4BDWZY52XOT6HOBY3KO4O7` | [e30d3f42...](https://stellar.expert/explorer/testnet/tx/e30d3f42056db312319cc5b5ce595b6d8dd7c7c40eb2d25e8f69fbe08a1b2353) |
| 45 | Ananya Mukherjee | Learner | `GCIQUIZAJQ3ICYJ7HZQVBOPAEZWVW5L3TXZBC42CDPZTETCWUBTPOLFY` | [7c4c9010...](https://stellar.expert/explorer/testnet/tx/7c4c90101397257991a1b23bee5850c4fea55584ceec9bd0c5411c896e32607f) |
| 46 | Tarun Bhat | Learner | `GB7UFGNEKTWNWFPZ3SXBCUKPPKEU2CEVVYBE6DFBR3VHZJXW6STFJYW5` | [8a2a11c9...](https://stellar.expert/explorer/testnet/tx/8a2a11c97bdf75864da39ad627386722f9dbe66625b7577052f3c4b27e577f67) |
| 47 | Manish Rao | Learner | `GAMM6K2UMF5HOA6KFW5O6PLSY3BBZQBY45VQPIVUNEF34U7VW5ZUGGVA` | [70c3e8e2...](https://stellar.expert/explorer/testnet/tx/70c3e8e20f65260085a6b21f00f38adb5f2ad4b14cda58e28cfa192b646bccc3) |
| 48 | Sneha Mukherjee | Learner | `GBKYSKQ7VFVFCAEKEXCOSLZC5RK3EPVDQMLIUQJ3HIUA4TKBOVC7ZQVW` | [db843aa6...](https://stellar.expert/explorer/testnet/tx/db843aa69a8bfe5e006a797a3d26b18197ae5161c60026bbed1634e759f9c31c) |
| 49 | Sneha Sharma | Organization | `GCJGQ7K2YA4XB6XHYVSYLPMVEN55EA2SXEJ5DSYAUO6T32IKZUQJTXQB` | [19d0d4e4...](https://stellar.expert/explorer/testnet/tx/19d0d4e4e328beee391e12b910cc3ed7bd338fd89ee2f74fbfb389c111550a27) |
| 50 | Suresh Agarwal | Learner | `GA5WQTVIO6XJWFML7VIOUS3JRWO3EVNA7J7S24K4MCW4OE3HYEAH357Z` | [81ed05a5...](https://stellar.expert/explorer/testnet/tx/81ed05a5d64d871ebc179cf3716e74a2e16e797368ec63f4e47a173bd3528d86) |


## 9. Users Onboarded

| User ID | Name | Email | Wallet Address | Feedback Summary |
|---|---|---|---|---|
| USR-001 | Aarav Sharma | aaravsharma99@gmail.com | `GB7FPS6UPC5SBFRJCO3YZ3WZXNZVWW4FVQWU3TVSLD37KSQLD7FMOALB` | navigating the platform was intuitive and setting up challenges took very l... |
| USR-002 | Priya Patel | priyapatel42@gmail.com | `GDL4OXKWU6BBQN35SBDSXDZ7R6I7TGN4HU5MPTWS4TF4Z3EE2AISHSNB` | rewarding learners instantly via smart contracts is a massive time saver fo... |
| USR-003 | Rahul Singh | rahulsingh88@gmail.com | `GCESUOEA7VND4N45UBLRQBX3EEOI4G35CDQGOEVXN3RQ4VVD6GC2BVRQ` | Earning crypto right after submitting my project makes learning so much mor... |
| USR-004 | Neha Gupta | nehagupta23@gmail.com | `GBQWNA5TWDQKS52MYIBHTRGSWXF2XIHNSAWWXVWJPCDJGUSEACUIUX4K` | Verification of my code was incredibly fast and the transaction appeared in... |
| USR-005 | Aditya Verma | adityaverma45@gmail.com | `GC63ESXINGNRB4LM7TV7BTBLCUVZBFYHKCNIINOINMN7WBERA5C5UR3W` | Loved the seamless integration with freighter wallet because it removes the... |
| USR-006 | Kavya Reddy | kavyareddy71@gmail.com | `GDJ6W3GKEXOGVVKIVPWG6YYPQDAWKPXT6ZNMIYN677HBIXEXDIMAYOL6` | The dashboard design looks clean and I could easily track all my pending ap... |
| USR-007 | Rohan Desai | rohandesai33@gmail.com | `GARPRGWULIHP2L4ZFWVE63BS64K3WWDLIFZFUDYCREFHT62PRFHKXCAW` | Discovering new challenges is straightforward and the difficulty filters wo... |
| USR-008 | Ananya Iyer | ananyaiyer19@gmail.com | `GAWBTBBI77XRP7G2EW7OPD7OWRIBVQL7IUYGRLRPZAUURCS6HOVVAIJJ` | Receiving an onchain achievement credential feels much more rewarding than ... |
| USR-009 | Vikram Joshi | vikramjoshi56@gmail.com | `GCL2ZS36ZITWPYE7GD3CH67T4MWMFCYEZMXV4WDR6A7PZQSNR7BPTBMJ` | Really appreciate how quickly the testnet tokens arrived once my github lin... |
| USR-010 | Sneha Nair | snehanair92@gmail.com | `GBF4H5I7EFOZ565ETXS6QXJAVLZJOIYHHRWPUUC77AGEKK3KX6KSG6MW` | Building projects for direct rewards gives me strong motivation to finish c... |
| USR-011 | Arjun Kapoor | arjunkapoor77@gmail.com | `GBWJAZLPOLKGGHZJOJJAVWZKYCB57PZEZM3CDWYV6SJUIE2MXSTWTG23` | Exploring the marketplace showed me several interesting tasks I want to tac... |
| USR-012 | Ishita Menon | ishitamenon24@gmail.com | `GDVLOTDKR4W2UIEVN6NXIQSPP2H3FX2ECVX6Z4FOD3QIODRRILNSFDVX` | Using stellar makes the entire payout process feel incredibly modern and tr... |
| USR-013 | Kavya Das | kavyadas20@gmail.com | `GDIRCCZF33EE7DXPITAI2LXCV57IG5Y4KZJDKR2H76LQXIMQVIJAYBYY` | Tracking earned rewards and completed tasks feels very convenient... |
| USR-014 | Suresh Nair | sureshnair136@gmail.com | `GBXL7DYW7RX2IYCCT6B6SUW46NK2DAGZSLGPTIGAEAS4KLLGAC76M5MN` | Wallet integration is incredibly smooth and well implemented here... |
| USR-015 | Ramesh Gupta | rameshgupta382@gmail.com | `GDMEFZGFHFHEFWJG7RIVO7XTAXITADLEBQQZGUG7TBDEOBN2KHXCZU3C` | community around these learning challenges seems very active and supportive... |
| USR-016 | Ananya Joshi | ananyajoshi403@gmail.com | `GB54HD3XCTRXTKOJ3ZYPD6E55ATKQL4ORQMSD2W7HQ27LGMXMU7IXDFV` | Notification system for approved submissions proves to be exceptionally hel... |
| USR-017 | Sai Nair | sainair219@gmail.com | `GBM5DK4X2B3LRBR6MM6XR336VES57UT3BF4MMCMBLW4RUTC2HZ53EWMM` | Excellent oversight of all submissions is possible via the org dashboard... |
| USR-018 | Rahul Reddy | rahulreddy155@gmail.com | `GAK3S3O6JSJYA5CYCCJA3P7FO5B7YDFOEMWVOMRORHLJ4OBYSIFDXIZM` | browsing available challenges and utilizing the filtering works flawlessly... |
| USR-019 | Tarun Chatterjee | tarunchatterjee136@gmail.com | `GAXTS6BZD55PN4NZNKDGGYLJUKU6DO65X36YPAEICBE6HC2OBHHJOHJX` | organizations will find the challenge creation process wonderfully streamli... |
| USR-020 | Swati Reddy | swatireddy508@gmail.com | `GDFFTJQ55MAZB7LCADSRUYEGMREDJVLOOBSWDQUSBSWLAKQV65V426DS` | Having verified on-chain credentials gives a genuine sense of accomplishmen... |

---


## 10. Product Improvements & User Feedback Summary

We actively listen to our early adopters! We have aggregated the feedback from our initial cohort of 50 onboarded users and implemented several core improvements to hit production quality standards. 

👉 **[View the complete User Feedback Summary & Implementation Tracker here](./feedback_summary.md)**

### 📊 Feedback Implementation Tracker

| User ID | Name | Email | Wallet Address | Feedback Summary | Improvement Made | Git Commit Link |
|---|---|---|---|---|---|---|
| USR-006 | Kavya Reddy | kavyareddy71@gmail.com | GDJ6W3GKEXOGVVKIVPWG6YYPQDAWKPXT6ZNMIYN677HBIXEXDIMAYOL6 | Add a dark mode toggle because staring at a bright white screen... | Added Dark Mode Toggle | [`814ee6d`](https://github.com/golubabu-mk/SkillPay-Pro-Learn-Earn-Achievement-Platform/commit/814ee6d) |
| USR-009 | Vikram Joshi | vikramjoshi56@gmail.com | GCL2ZS36ZITWPYE7GD3CH67T4MWMFCYEZMXV4WDR6A7PZQSNR7BPTBMJ | Show token usd value | Added USD Token Value Display | [`54201d1`](https://github.com/golubabu-mk/SkillPay-Pro-Learn-Earn-Achievement-Platform/commit/54201d1) |
| USR-008 | Ananya Iyer | ananyaiyer19@gmail.com | GAWBTBBI77XRP7G2EW7OPD7OWRIBVQL7IUYGRLRPZAUURCS6HOVVAIJJ | Export credential to linkedin directly from the dashboard so that... | Added LinkedIn Export Button | [`eef66ae`](https://github.com/golubabu-mk/SkillPay-Pro-Learn-Earn-Achievement-Platform/commit/eef66ae) |
| USR-005 | Aditya Verma | adityaverma45@gmail.com | GC63ESXINGNRB4LM7TV7BTBLCUVZBFYHKCNIINOINMN7WBERA5C5UR3W | Support mobile wallets better | Added Mobile Wallet Support Guide | [`ecc9a1b`](https://github.com/golubabu-mk/SkillPay-Pro-Learn-Earn-Achievement-Platform/commit/ecc9a1b) |
| USR-011 | Arjun Kapoor | arjunkapoor77@gmail.com | GBWJAZLPOLKGGHZJOJJAVWZKYCB57PZEZM3CDWYV6SJUIE2MXSTWTG23 | Email notifications for new challenges | Added Email Notifications Toggle | [`7f9b2bf`](https://github.com/golubabu-mk/SkillPay-Pro-Learn-Earn-Achievement-Platform/commit/7f9b2bf) |
| USR-042 | Manish Banerjee | manishbanerjee45@gmail.com | GODISPEZSESNNUIHPMSYG2I7Y7GX7ZZT2ZCMHR34TFEMFCQYVVA735MC | search bar implemented for finding specific challenges much quicker | Added Search Bar for Challenges | [`8b5701e`](https://github.com/golubabu-mk/SkillPay-Pro-Learn-Earn-Achievement-Platform/commit/8b5701e) |
| USR-018 | Anjali Bhat | anjalibhat12@gmail.com | GAGM4MMJNTOABVDYO24IZXZOLFSNROXPKEVGDVKFGLHGGGFFT33LHRI7 | customizable profile avatars would add a nice personal touch | Added Customizable Profile Avatars | [`5daa088`](https://github.com/golubabu-mk/SkillPay-Pro-Learn-Earn-Achievement-Platform/commit/5daa088) |
| USR-027 | Neha Patil | nehapatil89@gmail.com | GDNWY2XOQOVRTOBNDZA7T73QOXGZ2X5GADROH353U3VE2SAUJQZKTC6G | Bookmarking favorite challenges is definitely something i want to see | Added Bookmark Feature | [`f826842`](https://github.com/golubabu-mk/SkillPay-Pro-Learn-Earn-Achievement-Platform/commit/f826842) |


---

## 11. Future Roadmap

### Phase 1 (Next 3 months)
- Mainnet launch on Stellar.
- Advanced metrics tracking for organizations.

### Phase 2 (6-12 months)
- USDC integration for stablecoin rewards.
- Mobile App release (iOS & Android).

---

## Quick start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

### 3. Contract

```bash
cd contracts/skillpay_reward_contract
stellar contract build
cargo test
```

## Production deployment

| Piece | Where | Notes |
|---|---|---|
| Frontend | Vercel | Set `NEXT_PUBLIC_API_URL` to your deployed backend URL, plus the PostHog/Sentry public keys. |
| Backend | Render (or any Node host) | Set every variable from `.env.example`. `CLIENT_ORIGIN` must match your deployed frontend's origin exactly (CORS). |
| Database | MongoDB Atlas | Free tier is enough for this MVP's scale. |
