"use client";

import { useState } from "react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { liskSepoliaThirdweb } from "~~/chains";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { thirdwebClient } from "~~/services/web3/thirdwebConfig";
import { notification } from "~~/utils/scaffold-eth";

export const SmartWalletDemo = () => {
  const [mintToAddress, setMintToAddress] = useState("");
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const account = useActiveAccount();

  // Get contract address from deployments
  const nftAddress = deployedContracts?.[4202]?.MyNFT?.address as `0x${string}` | undefined;

  const { data: totalSupply, refetch: refetchSupply } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "totalSupply",
  });

  const { data: userNFTBalance, refetch: refetchBalance } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "balanceOf",
    args: [account?.address as `0x${string}`],
  });

  const handleGaslessMint = async () => {
    const targetAddress = mintToAddress || account?.address;

    if (!targetAddress || !account || !nftAddress) {
      notification.error("Please connect wallet");
      return;
    }

    setIsLoadingNFT(true);

    try {
      // Create thirdweb contract instance
      const nftContract = getContract({
        client: thirdwebClient,
        chain: liskSepoliaThirdweb,
        address: nftAddress,
      });

      // Prepare the contract call
      const transaction = prepareContractCall({
        contract: nftContract,
        method: "function mint(address to)",
        params: [targetAddress as `0x${string}`],
      });

      // Send transaction - gas is automatically sponsored! 🎉
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      notification.success(
        `Gasless NFT minted! View on Blockscout: https://sepolia-blockscout.lisk.com/tx/${transactionHash}`,
      );

      setMintToAddress("");

      // Refresh data
      setTimeout(() => {
        refetchSupply();
        refetchBalance();
      }, 2000);
    } catch (error: any) {
      console.error("Mint failed:", error);
      notification.error(error.message || "Mint failed");
    } finally {
      setIsLoadingNFT(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Smart Wallet Info Card */}
      <div className="card bg-gradient-to-br from-success/10 to-primary/10 border border-success/20 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-success text-success-content rounded-full w-16">
                  <span className="text-2xl">🎨</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">Your Smart Wallet</h3>
                <p className="text-sm text-base-content/70 font-mono">
                  {account?.address?.slice(0, 16)}...{account?.address?.slice(-12)}
                </p>
              </div>
            </div>
            <div className="badge badge-success badge-lg gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-success-content animate-pulse"></span>
              Active
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* NFT Statistics Cards */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60 mb-1">Total Minted</p>
                <p className="text-4xl font-bold text-secondary">{totalSupply?.toString() || "0"}</p>
              </div>
              <div className="rounded-full bg-secondary/10 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-base-content/60 mt-2">Network-wide NFT count</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60 mb-1">You Own</p>
                <p className="text-4xl font-bold text-accent">{userNFTBalance?.toString() || "0"}</p>
              </div>
              <div className="rounded-full bg-accent/10 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-base-content/60 mt-2">Your NFT collection</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60 mb-1">Gas Fees</p>
                <p className="text-4xl font-bold text-success">$0.00</p>
              </div>
              <div className="rounded-full bg-success/10 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-base-content/60 mt-2">100% sponsored!</p>
          </div>
        </div>
      </div>

      {/* Minting Card */}
      <div className="card bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
              🎨
            </div>
            <div>
              <h2 className="text-2xl font-bold">Mint NFT</h2>
              <p className="text-sm text-base-content/60">100% Gasless - Powered by ERC-4337</p>
            </div>
          </div>

          <div className="bg-base-200 rounded-xl p-6 mb-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Recipient Address (Optional)</span>
                <span className="label-text-alt text-success">Gas: $0.00</span>
              </label>
              <input
                type="text"
                placeholder="Leave empty to mint to yourself"
                className="input input-bordered w-full focus:input-primary"
                value={mintToAddress}
                onChange={e => setMintToAddress(e.target.value)}
              />
              <label className="label">
                <span className="label-text-alt">Enter an address or leave empty to mint to your Smart Wallet</span>
              </label>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg w-full gap-3 shadow-lg"
            onClick={handleGaslessMint}
            disabled={isLoadingNFT}
          >
            {isLoadingNFT ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Minting Your NFT...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Mint NFT (Gas Free!)
              </>
            )}
          </button>

          <div className="divider">Benefits</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 bg-success/5 rounded-lg p-4 border border-success/20">
              <div className="text-2xl">💰</div>
              <div>
                <div className="font-semibold text-sm mb-1">Zero Gas</div>
                <div className="text-xs text-base-content/70">thirdweb paymaster covers all fees</div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-primary/5 rounded-lg p-4 border border-primary/20">
              <div className="text-2xl">⚡</div>
              <div>
                <div className="font-semibold text-sm mb-1">Instant</div>
                <div className="text-xs text-base-content/70">Fast transaction execution</div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-secondary/5 rounded-lg p-4 border border-secondary/20">
              <div className="text-2xl">🔐</div>
              <div>
                <div className="font-semibold text-sm mb-1">Secure</div>
                <div className="text-xs text-base-content/70">ERC-4337 standard compliant</div>
              </div>
            </div>
          </div>

          <div className="alert alert-success mt-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <div className="font-bold">Fully Sponsored Transaction</div>
              <div className="text-xs">
                All gas fees are covered by thirdweb&apos;s paymaster. You pay absolutely nothing!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span>📚</span> How It Works
            </h3>
            <ul className="space-y-2 text-sm text-base-content/80">
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">1.</span>
                <span>Click &quot;Mint NFT&quot; to initiate gasless transaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">2.</span>
                <span>Sign the UserOperation (not a regular transaction)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">3.</span>
                <span>Bundler submits to blockchain with sponsored gas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success font-bold">4.</span>
                <span>NFT is minted to your address - $0 cost!</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span>🔧</span> Technology Stack
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                <span className="text-sm font-semibold">ERC-4337</span>
                <span className="badge badge-primary badge-sm">Account Abstraction</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                <span className="text-sm font-semibold">Smart Wallet</span>
                <span className="badge badge-secondary badge-sm">thirdweb</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                <span className="text-sm font-semibold">Paymaster</span>
                <span className="badge badge-success badge-sm">Gas Sponsor</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                <span className="text-sm font-semibold">MyNFT Contract</span>
                <span className="badge badge-accent badge-sm">OpenZeppelin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
