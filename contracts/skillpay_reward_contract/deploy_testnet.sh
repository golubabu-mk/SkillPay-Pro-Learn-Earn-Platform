#!/bin/bash
set -e

echo "Deploying SkillPay Reward Contract to Stellar Testnet..."

# 1. Build the contract
echo "Building contract..."
cargo build --target wasm32-unknown-unknown --release
cargo run --release --target x86_64-unknown-linux-gnu

# 2. Add Testnet Network (if not already added)
# stellar network add \
#   --global testnet \
#   --rpc-url https://soroban-testnet.stellar.org:443 \
#   --network-passphrase "Test SDF Network ; September 2015"

# 3. Generate a deployer identity (if needed)
# stellar keys generate --global deployer --network testnet

# 4. Deploy the Wasm and create the contract instance
echo "Deploying to testnet..."
CONTRACT_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/skillpay_reward_contract.wasm \
  --source deployer \
  --network testnet)

echo "Contract successfully deployed!"
echo "Contract ID: $CONTRACT_ID"

# 5. Initialize the contract
echo "Initializing contract..."
stellar contract invoke \
  --id $CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- \
  initialize \
  --admin deployer

echo "SkillPay Reward Contract deployment and initialization complete."
