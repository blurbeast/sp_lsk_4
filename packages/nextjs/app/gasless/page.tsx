"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { liskSepoliaThirdweb } from "~~/chains";
import { SmartWalletDemo } from "~~/components/example-ui/SmartWalletDemo";
import { thirdwebClient } from "~~/services/web3/thirdwebConfig";

// Force dynamic rendering to avoid SSG errors with thirdweb hooks
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const Gasless: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const account = useActiveAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="badge badge-success badge-lg gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              ERC-4337 Powered
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
            ⛽ Gasless Transactions
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-6">
            Experience the future of Web3 with <span className="font-semibold text-success">$0 gas fees</span> powered
            by ERC-4337 Smart Wallets
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="bg-base-100 rounded-lg p-4 border border-base-300">
              <div className="text-3xl mb-2">💰</div>
              <div className="font-semibold">$0 Gas Fees</div>
              <div className="text-xs text-base-content/60">All transactions sponsored</div>
            </div>
            <div className="bg-base-100 rounded-lg p-4 border border-base-300">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-semibold">Smart Wallets</div>
              <div className="text-xs text-base-content/60">Programmable accounts</div>
            </div>
            <div className="bg-base-100 rounded-lg p-4 border border-base-300">
              <div className="text-3xl mb-2">🔐</div>
              <div className="font-semibold">Secure & Safe</div>
              <div className="text-xs text-base-content/60">Battle-tested ERC-4337</div>
            </div>
          </div>

          {/* Smart Wallet Connect Button */}
          <div className="flex justify-center mb-8">
            <div className="bg-base-100 rounded-2xl p-6 shadow-2xl border border-base-300">
              <div className="mb-4">
                <p className="text-sm text-base-content/70 mb-3">
                  {account ? "🎉 Smart Wallet Connected!" : "Connect to create your Smart Wallet"}
                </p>
              </div>
              <ConnectButton
                client={thirdwebClient}
                chain={liskSepoliaThirdweb}
                accountAbstraction={{
                  chain: liskSepoliaThirdweb,
                  sponsorGas: true,
                }}
              />
              {!account && (
                <div className="alert alert-info mt-4 text-left">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">What&apos;s a Smart Wallet?</div>
                    <div className="text-xs">
                      A programmable on-chain account that enables gasless transactions and advanced features
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        {account ? (
          <SmartWalletDemo />
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-success/10 p-3 shrink-0">
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
                    <div>
                      <h3 className="font-bold text-lg mb-2">How It Works</h3>
                      <ul className="text-sm text-base-content/70 space-y-2">
                        <li>✓ Connect wallet to create Smart Wallet</li>
                        <li>✓ Smart Wallet deployed automatically</li>
                        <li>✓ Transactions sponsored by paymaster</li>
                        <li>✓ You pay $0 in gas fees!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3 shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">What You Can Do</h3>
                      <ul className="text-sm text-base-content/70 space-y-2">
                        <li>🎨 Mint NFTs with zero gas</li>
                        <li>💸 Transfer tokens for free</li>
                        <li>🔄 Batch multiple transactions</li>
                        <li>🎯 Better UX for your users</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technology Stack */}
            <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
              <div className="card-body">
                <h3 className="font-bold text-xl mb-4 text-center">Powered By</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="bg-base-100 rounded-lg p-4 shadow-md">
                      <div className="font-bold">ERC-4337</div>
                      <div className="text-xs text-base-content/60">Account Abstraction</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-base-100 rounded-lg p-4 shadow-md">
                      <div className="font-bold">thirdweb</div>
                      <div className="text-xs text-base-content/60">Smart Wallet SDK</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-base-100 rounded-lg p-4 shadow-md">
                      <div className="font-bold">Paymaster</div>
                      <div className="text-xs text-base-content/60">Gas Sponsorship</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-base-100 rounded-lg p-4 shadow-md">
                      <div className="font-bold">Lisk Sepolia</div>
                      <div className="text-xs text-base-content/60">Testnet</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gasless;
