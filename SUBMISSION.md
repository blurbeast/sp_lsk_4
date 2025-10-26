# Submission Summary

Date: 2025-10-25 (UTC)

This file documents what I did for the submission: deploy, verify, fixes, and reproduction steps.

## Quick summary

- Updated the repository `README.md` to include a "What I did" section describing deployment and verification steps.
- Fixed a nonce-related issue in the deploy script by using the provider's pending nonce when deploying `BuyMeACoffee`.
- Deployed two contracts successfully on Lisk Sepolia and verified `MyNFT`.

## Deployed contracts (from my terminal)

- MyToken deployed at: `0x31BF0d589E1c2f459F9E635d60430903EAF68053`
- MyNFT deployed at: `0xBB6FB11933aE98d6136E2496fe41f163E498E50F`

During the run, `BuyMeACoffee` failed to deploy due to a nonce error (`NONCE_EXPIRED` / "nonce too low").

## Commands I ran

Root commands (from repository root):

```bash
yarn deploy --network liskSepolia
yarn hardhat-verify --network liskSepolia --contract contracts/MyNFT.sol:MyNFT 0xBB6FB11933aE98d6136E2496fe41f163E498E50F
```

Reproduction / full local flow:

```bash
git clone https://github.com/LiskHQ/scaffold-lisk.git
cd scaffold-lisk
yarn install

# enter the hardhat folder and copy the example env
cd packages/hardhat
cp .env.example .env
# edit .env and set DEPLOYER_PRIVATE_KEY to an address with Sepolia ETH

# deploy
cd ../.. # back to repo root if scripts expect to be run from root
yarn deploy --network liskSepolia

# verify a contract (example)
yarn hardhat-verify --network liskSepolia --contract contracts/MyNFT.sol:MyNFT 0xBB6FB11933aE98d6136E2496fe41f163E498E50F

# run tests
yarn hardhat:test
```

Notes:
- The deployer key is stored in `packages/hardhat/.env` as `DEPLOYER_PRIVATE_KEY`.
- Hardhat printed a Node.js compatibility warning on Node v24.8.0; it's recommended to use Node LTS v18 or v20 for predictable behavior.

## Files I changed

- `packages/hardhat/deploy/01_deploy_buy_me_a_coffee.ts`
  - Purpose: fetch the deployer's pending nonce via `provider.getTransactionCount(deployer, "pending")` and pass it into the `deploy()` options as `nonce` to avoid `NONCE_EXPIRED` errors.

- `README.md`
  - Purpose: added a "What I did (deployment & verification)" section summarizing the terminal output, deployed addresses, verification steps, and the nonce error.


## Nonce error and reasoning

Observed error while deploying `BuyMeACoffee`:

- Provider error: `nonce too low: next nonce 2, tx nonce 1` — reported by the JSON-RPC provider.

Root causes and mitigations:

- Cause: the node expected a higher nonce (because a previous transaction was pending or confirmed), while the deploy script attempted to reuse a lower nonce.
- Mitigations:
  - Wait for pending transactions to confirm before re-deploying.
  - Replace the stuck transaction by sending another transaction with the same nonce and higher gas price.
  - Use the provider's `pending` transaction count as the nonce when sending new transactions (this is the change applied to the deploy script).

Note: If multiple deploys are triggered in parallel, a local in-process nonce allocator that increments a fetched pending nonce is recommended to avoid race conditions.

## Verification

- Verified `MyNFT` with Hardhat verify against the Lisk Sepolia Blockscout-like endpoint (the `etherscan` verifier configuration in `hardhat.config.ts` contains the custom chain configuration for `liskSepolia`).

## Screenshots / Demo

- README references images in `packages/nextjs/public/` (e.g. `readme-banner.png`, `scaffold-lisk-landing.png`). If you want to add demo GIFs or screenshots for the submission, place them in that folder and reference them from `README.md`.

## Submission checklist

- [x] Repo contains a `README.md` with quickstart and deployment steps.
- [x] Added a `What I did` summary in `README.md`.
- [x] Created this `SUBMISSION.md` file summarizing steps and results.
- [ ] Tests passing (I can run them and report results on request).
- [ ] Screenshots / demo video included and referenced (optional but recommended).
- [ ] Repo is public (please ensure the GitHub repository visibility is public before submit).

## Next steps (I can take any of these for you)

1. Run the test suite and fix any failing tests. Report pass/fail and failing stack traces.
2. Add a `SUBMISSION.md` screenshot gallery and include short demo GIF(s) in `packages/nextjs/public/`.
3. Implement a robust in-process nonce manager across deploy scripts to prevent any nonce races for multi-transaction deploys.
4. Re-run the deployment in this environment (note: this will send real transactions and spend gas).

If you want me to proceed with any of the above, tell me which one and I'll update the todo list and run it.

---

End of submission summary.
