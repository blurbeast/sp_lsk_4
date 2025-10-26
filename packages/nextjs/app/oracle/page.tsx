"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { PriceDisplay } from "~~/components/example-ui/PriceDisplay";

const Oracle: NextPage = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-base-300 to-base-100">
        <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h2 className="card-title justify-center text-2xl mb-2">🔮 Oracle Price Feeds</h2>
            <p className="text-base-content/70 mb-4">
              Connect your wallet to access real-time cryptocurrency prices powered by RedStone Oracle
            </p>
            <div className="alert alert-info">
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
              <span className="text-sm">Live data from decentralized oracle networks</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="badge badge-primary badge-lg gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Live Oracle Data
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🔮 Live Price Feeds
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Real-time cryptocurrency prices powered by{" "}
            <span className="font-semibold text-primary">RedStone Oracle</span>
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <div className="stat bg-base-100 rounded-lg shadow-lg border border-base-300">
              <div className="stat-title">Data Source</div>
              <div className="stat-value text-2xl text-primary">RedStone</div>
              <div className="stat-desc">Decentralized Oracle</div>
            </div>
            <div className="stat bg-base-100 rounded-lg shadow-lg border border-base-300">
              <div className="stat-title">Update Frequency</div>
              <div className="stat-value text-2xl text-secondary">30s</div>
              <div className="stat-desc">Auto-refresh</div>
            </div>
          </div>
        </div>

        {/* Price Cards Section */}
        <div className="flex justify-center items-start gap-8 flex-col lg:flex-row">
          <PriceDisplay symbol="ETH" />
          <PriceDisplay symbol="BTC" />
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-full bg-success/10 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Verified Data</h3>
                </div>
                <p className="text-sm text-base-content/70">
                  All prices are cryptographically signed and verified on-chain
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-full bg-warning/10 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-warning"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Real-Time</h3>
                </div>
                <p className="text-sm text-base-content/70">
                  Prices update automatically every 30 seconds from live markets
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-full bg-info/10 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-info"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Decentralized</h3>
                </div>
                <p className="text-sm text-base-content/70">
                  Multiple oracle nodes ensure data accuracy and reliability
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Oracle;
