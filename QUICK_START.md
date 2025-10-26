# 🚀 Quick Start Guide - Week 4

## Install Dependencies (REQUIRED!)

```bash
# In packages/hardhat
cd packages/hardhat
yarn add @redstone-finance/evm-connector

# In packages/nextjs
cd packages/nextjs
yarn add @redstone-finance/evm-connector @redstone-finance/sdk ethers@^5.7.2 thirdweb
```

## Setup thirdweb API Key

1. Get Client ID from [thirdweb.com/dashboard/settings/api-keys](https://thirdweb.com/dashboard/settings/api-keys)
2. Create `.env.local`:
   ```bash
   cd packages/nextjs
   cp .env.local.example .env.local
   ```
3. Add your Client ID to `.env.local`:
   ```env
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_actual_client_id
   ```

## Deploy & Test

```bash
# Deploy contracts
yarn deploy --network liskSepolia

# Verify PriceFeed
yarn hardhat-verify --network liskSepolia --contract contracts/PriceFeed.sol:PriceFeed YOUR_PRICEFEED_ADDRESS

# Start frontend
yarn start
```

## Test Pages

- **Oracle**: http://localhost:3000/oracle - Live ETH/BTC prices
- **Gasless**: http://localhost:3000/gasless - Mint NFTs with $0 gas!

---

See **WEEK4_IMPLEMENTATION_GUIDE.md** for detailed instructions!
