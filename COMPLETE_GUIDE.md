# 🎯 Week 4 Challenge: Complete Setup & Testing Guide

## Overview
This guide covers everything you need to complete the Week 4 Challenge: Oracles & Sponsored Transactions for Lisk SEA Campaign.

---

## 📋 Prerequisites

✅ Completed Challenge 1-3 (contracts deployed, frontend working)  
✅ Node.js >= v18.17  
✅ Yarn installed  
✅ MetaMask or another Web3 wallet  
✅ Some Lisk Sepolia ETH (from [Superchain Faucet](https://app.optimism.io/faucet))  

---

## 🚀 Part 1: Setup (REQUIRED!)

### Step 1: Install All Dependencies

**Important:** The packages were not auto-installed. Run these commands:

```bash
# Navigate to hardhat directory
cd packages/hardhat
yarn add @redstone-finance/evm-connector

# Navigate to nextjs directory  
cd ../nextjs
yarn add @redstone-finance/evm-connector @redstone-finance/sdk ethers@^5.7.2 thirdweb
```

**Why these packages?**
- `@redstone-finance/evm-connector`: Oracle integration for smart contracts
- `@redstone-finance/sdk`: Oracle data fetching utilities
- `ethers@^5.7.2`: Required by RedStone (v5 specifically)
- `thirdweb`: Smart Wallet and Account Abstraction SDK

---

### Step 2: Get thirdweb API Key (FREE)

1. **Go to thirdweb:**
   - Visit [thirdweb.com](https://thirdweb.com)
   - Sign in with email or wallet (free account)

2. **Create API Key:**
   - Navigate to **Settings** → **API Keys**
   - Click **Create API Key**
   - Copy your **Client ID** (starts with a long string)

3. **Configure Environment:**
   ```bash
   cd packages/nextjs
   cp .env.local.example .env.local
   ```

4. **Edit `.env.local`:**
   ```env
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_actual_client_id_here
   ```

   Replace `your_actual_client_id_here` with the Client ID you copied!

---

## 🔨 Part 2: Deploy Contracts

### Option A: Local Testing (Recommended First)

**Terminal 1 - Start Local Chain:**
```bash
cd /home/uche12345/speedrunlisk/lisk-sea-campaign-week4
yarn chain
```
Keep this terminal running!

**Terminal 2 - Deploy Contracts:**
```bash
yarn deploy
```

This deploys:
- ✅ Your existing contracts (MyToken, MyNFT, etc.)
- ✅ New PriceFeed contract for oracle integration

**Save the PriceFeed address** that appears in the console!

---

### Option B: Deploy to Lisk Sepolia (For Submission)

```bash
yarn deploy --network liskSepolia
```

**After deployment, verify the PriceFeed contract:**
```bash
yarn hardhat-verify --network liskSepolia --contract contracts/PriceFeed.sol:PriceFeed YOUR_PRICEFEED_ADDRESS
```

Replace `YOUR_PRICEFEED_ADDRESS` with the actual address from deployment!

---

## 🖥️ Part 3: Start & Test the App

### Start Frontend
```bash
yarn start
```

The app will open at: http://localhost:3000

---

## 🧪 Part 4: Testing Checklist

### Test 1: Oracle Integration (/oracle)

1. **Open Oracle Page:**
   - Go to http://localhost:3000/oracle
   - You should see "Oracle Price Feeds" title

2. **Connect Wallet:**
   - Click "Connect Wallet" (RainbowKit button in header)
   - Connect your MetaMask
   - Switch to Lisk Sepolia network if needed

3. **View Prices:**
   - ✅ ETH/USD price card appears
   - ✅ BTC/USD price card appears
   - ✅ Prices show as dollar amounts (e.g., $2,500.50)
   - ✅ "Updated" timestamp shows

4. **Test Refresh:**
   - Click "Refresh" button on either card
   - ✅ Loading spinner appears
   - ✅ Price updates
   - ✅ Timestamp changes

5. **Automatic Updates:**
   - Wait 30 seconds
   - ✅ Prices auto-refresh
   - ✅ No errors in console

**Common Issues:**
- ❌ "PriceFeed contract not deployed" → Run `yarn deploy`
- ❌ "Cannot find module" errors → Install packages (Part 1, Step 1)
- ❌ Prices show as "0.00" → Check console for errors, may need to refresh

---

### Test 2: Gasless Transactions (/gasless)

1. **Open Gasless Page:**
   - Go to http://localhost:3000/gasless
   - You should see "Gasless Transactions" title

2. **Create Smart Wallet:**
   - Click "Connect" button (thirdweb button, NOT RainbowKit)
   - Choose your wallet (MetaMask, etc.)
   - Sign the message to create Smart Wallet
   - ✅ Smart Wallet address appears
   - ✅ NFT statistics card shows

3. **View NFT Stats:**
   - ✅ "Total Minted" count (should match your MyNFT data)
   - ✅ "You Own" count (your NFT balance)
   - ✅ Smart Wallet address truncated

4. **Mint NFT (Gasless!):**
   - Leave "Mint to address" empty (mints to yourself)
   - Click **"Mint NFT (Gas Free!)"**
   - Sign the transaction in wallet
   - ✅ **Check that gas fee is $0.00!** 🎉
   - ✅ Success notification appears
   - ✅ Transaction link to Blockscout

5. **Verify Mint:**
   - Wait 2-3 seconds for stats to refresh
   - ✅ "Total Minted" increased by 1
   - ✅ "You Own" increased by 1

6. **Test Custom Address (Optional):**
   - Enter a different address in "Mint to address"
   - Click "Mint NFT (Gas Free!)"
   - ✅ Still $0 gas!
   - ✅ NFT minted to that address

**Common Issues:**
- ❌ "useActiveAccount must be used within..." → ThirdwebProvider issue (should be fixed)
- ❌ "Cannot find module 'thirdweb'" → Install thirdweb (Part 1, Step 1)
- ❌ "NEXT_PUBLIC_THIRDWEB_CLIENT_ID is undefined" → Setup .env.local (Part 1, Step 2)
- ❌ Gas isn't $0 → Check you connected with thirdweb button, not RainbowKit
- ❌ Mint fails → Check MyNFT is deployed, check console for errors

---

## 📸 Part 5: Document Your Work

### Take Screenshots
1. **Oracle page** showing live ETH/BTC prices
2. **Gasless page** with Smart Wallet connected
3. **Mint transaction** showing **$0 gas fee**
4. **Blockscout transaction** confirming gasless mint
5. **NFT stats** showing increased counts

### Get Transaction Hash
- Click "View on Blockscout" link after minting
- Copy the transaction hash from URL
- Save it for submission!

---

## 🚢 Part 6: Deploy to Production

### 1. Verify PriceFeed Contract
```bash
yarn hardhat-verify --network liskSepolia --contract contracts/PriceFeed.sol:PriceFeed ADDRESS
```

### 2. Deploy Frontend to Vercel

**Option A: Through Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variable:
   - Key: `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`
   - Value: Your thirdweb Client ID
4. Deploy!

**Option B: Vercel CLI**
```bash
cd packages/nextjs
vercel --prod
```

When prompted for environment variables, add your thirdweb Client ID.

---

## 📝 Part 7: Submit Your Work

Go to the **Week 4 Submission Form** and provide:

### Required Information
- ✅ **Frontend URL**: Your Vercel deployment URL
- ✅ **PriceFeed Contract**: `0x...` address
- ✅ **MyToken Contract**: `0x...` address (from Week 1)
- ✅ **MyNFT Contract**: `0x...` address (from Week 1)
- ✅ **Smart Wallet Address**: Your Smart Wallet address
- ✅ **GitHub Repository**: Link to your code
- ✅ **Gasless Transaction**: Blockscout link to a $0 gas mint

### Verification Links
- ✅ PriceFeed on Blockscout (verified)
- ✅ MyToken on Blockscout (from Week 1)
- ✅ MyNFT on Blockscout (from Week 1)

### Bonus Points
- 📸 Screenshot of $0 gas cost
- 🐦 Tweet about gasless minting with #LiskSEA
- 📊 Show your NFT collection growing

---

## 🔍 Troubleshooting Common Issues

### "Cannot find module" Errors
**Cause:** Packages not installed  
**Fix:** Run the install commands from Part 1, Step 1

### Oracle Shows "PriceFeed contract not deployed"
**Cause:** Contract not deployed or types not generated  
**Fix:**
```bash
yarn deploy
# If still failing, regenerate types:
cd packages/hardhat && yarn hardhat compile
cd ../nextjs && yarn start
```

### Gasless Page: "useActiveAccount must be used within ThirdwebProvider"
**Cause:** ThirdwebProvider not wrapping app  
**Fix:** This should already be fixed in ScaffoldEthAppWithProviders.tsx. If still happening:
1. Check `packages/nextjs/components/ScaffoldEthAppWithProviders.tsx`
2. Ensure `<ThirdwebProvider>` wraps `<WagmiConfig>`

### Gas Fee Is Not $0
**Cause:** Connected with wrong wallet type  
**Fix:**
1. Disconnect RainbowKit wallet (in header)
2. Connect with thirdweb button (on /gasless page)
3. Make sure you're creating a Smart Wallet, not using regular wallet

### thirdweb API Rate Limit
**Cause:** Too many requests  
**Fix:**
- Free tier is very generous
- If hitting limits, wait a few minutes
- Consider upgrading to Growth plan for production

### Prices Show as "0.00"
**Cause:** Oracle data fetch failed  
**Fix:**
1. Check browser console for errors
2. Verify you're on Lisk Sepolia network
3. Try clicking "Refresh" button
4. Check if RedStone API is working: [redstone.finance](https://redstone.finance)

---

## 🎓 What You've Learned

By completing this challenge, you now understand:

### Oracle Integration
- ✅ How oracles bring real-world data to blockchain
- ✅ RedStone Pull oracle architecture (vs Push)
- ✅ Using ethers.js + viem together
- ✅ Cryptographic signature verification
- ✅ Timestamp validation for data freshness

### Account Abstraction (ERC-4337)
- ✅ Smart Wallets vs EOA wallets
- ✅ UserOperations vs transactions
- ✅ Paymaster-sponsored gas
- ✅ Bundler infrastructure
- ✅ EntryPoint contract execution flow

### Key Insight
**Your existing contracts work with gasless transactions with ZERO modifications!**

This proves ERC-4337 is truly backward-compatible with all existing Ethereum contracts.

---

## 🚀 Going Further (Optional)

### Advanced Oracle Features
1. **More Price Feeds**: Add USDT, USDC, DAI prices
2. **Historical Data**: Store price history on-chain
3. **Price Alerts**: Emit events when price crosses threshold
4. **DeFi Integration**: Use prices for DEX, lending, etc.

### Advanced Account Abstraction
1. **Session Keys**: 
   ```typescript
   const sessionKey = await createSessionKey({
     account,
     approvedTargets: [nftContract.address],
     nativeTokenLimitPerTransaction: 0,
   });
   ```

2. **Batch Transactions**:
   ```typescript
   const batch = [
     prepareContractCall({ contract, method: "approve", params: [...] }),
     prepareContractCall({ contract, method: "transfer", params: [...] }),
   ];
   await sendBatchTransaction({ transactions: batch, account });
   ```

3. **Pay Gas in ERC-20**:
   ```typescript
   accountAbstraction={{
     sponsorGas: false,
     tokenPaymaster: { token: "USDC" }
   }}
   ```

4. **Social Recovery**: Add guardians to recover Smart Wallet

---

## 📚 Additional Resources

### Documentation
- [RedStone Oracle Docs](https://docs.redstone.finance/)
- [thirdweb Account Abstraction](https://portal.thirdweb.com/connect/account-abstraction)
- [ERC-4337 Standard](https://eips.ethereum.org/EIPS/eip-4337)
- [Lisk Documentation](https://docs.lisk.com/)

### Community
- [Lisk SEA Telegram](https://t.me/LiskSEA)
- [thirdweb Discord](https://discord.gg/thirdweb)
- [Scaffold-ETH Discord](https://discord.gg/scaffold-eth)

### Alternative Providers
- [Gelato](https://gelato.network) - Lisk's infrastructure partner
- [Biconomy](https://biconomy.io) - Modular AA stack
- [Pimlico](https://pimlico.io) - Developer-focused bundler
- [Alchemy](https://alchemy.com) - Account Kit

---

## ✅ Final Checklist

Before submitting, ensure:

- [ ] All packages installed (no "Cannot find module" errors)
- [ ] .env.local created with thirdweb Client ID
- [ ] PriceFeed contract deployed to Lisk Sepolia
- [ ] PriceFeed contract verified on Blockscout
- [ ] Oracle page showing live ETH/BTC prices
- [ ] Smart Wallet created and connected
- [ ] NFT minted with $0 gas (screenshot saved!)
- [ ] Transaction visible on Blockscout
- [ ] Frontend deployed to Vercel
- [ ] All contract addresses saved
- [ ] Submission form filled out

---

## 🎉 Congratulations!

You've successfully implemented:
- 🔮 Oracle integration with RedStone
- ⛽ Gasless transactions with ERC-4337
- 💰 $0 gas fees for users
- 🎨 Seamless Web3 UX

You're now ready to build production-grade dApps with real-world data and modern UX patterns!

**Good luck with your submission! 🚀**

---

**Need help?** Join [@LiskSEA Telegram](https://t.me/LiskSEA) 💬
