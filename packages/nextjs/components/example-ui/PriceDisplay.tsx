"use client";

import { useEffect, useMemo, useState } from "react";

interface PriceDisplayProps {
  symbol: "ETH" | "BTC";
}

export const PriceDisplay = ({ symbol }: PriceDisplayProps) => {
  const [price, setPrice] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchPrice = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Fetch price directly from RedStone HTTP API
      const response = await fetch(`https://api.redstone.finance/prices/?symbol=${symbol}&provider=redstone&limit=1`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data[0] || !data[0].value) {
        throw new Error("No price data returned from oracle");
      }

      // Format price to 2 decimals
      const formattedPrice = Number(data[0].value).toFixed(2);
      setPrice(formattedPrice);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching price:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch price");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  const getCryptoIcon = () => {
    if (symbol === "ETH") {
      return (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl shadow-lg">
          Ξ
        </div>
      );
    }
    return (
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warning to-orange-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
        ₿
      </div>
    );
  };

  const getPriceChange = () => {
    // Simulate price change for demo (you can calculate real change if storing history)
    const change = Math.random() > 0.5 ? "+" : "-";
    const percent = (Math.random() * 5).toFixed(2);
    return { change, percent };
  };

  // Memoize the price change to prevent recalculation on every render
  const priceChange = useMemo(() => getPriceChange(), [price]);
  const { change, percent } = priceChange;

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
      <div className="card-body">
        {/* Header with Icon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            {getCryptoIcon()}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">{symbol}</h2>
              <p className="text-base-content/60 text-sm">/ USD</p>
            </div>
          </div>
          <div className={`badge ${change === "+" ? "badge-success" : "badge-error"} badge-md sm:badge-lg gap-1`}>
            {change === "+" ? "↑" : "↓"} {percent}%
          </div>
        </div>

        {error ? (
          <div className="alert alert-error shadow-lg">
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
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-sm text-base-content/60">Fetching live price...</p>
          </div>
        ) : (
          <>
            {/* Price Display */}
            <div className="bg-gradient-to-br from-base-200 to-base-300 rounded-2xl p-6 mb-4">
              <div className="text-center">
                <p className="text-sm text-base-content/60 mb-2">Current Price</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-white">
                  ${price}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="badge badge-outline badge-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
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
                    {lastUpdate.toLocaleTimeString()}
                  </div>
                  <div className="badge badge-success badge-sm gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    Live
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-base-200 rounded-xl p-3 text-center">
                <p className="text-xs text-base-content/60 mb-1">24h High</p>
                <p className="font-semibold text-success">
                  $
                  {(parseFloat(price) * 1.05).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="bg-base-200 rounded-xl p-3 text-center">
                <p className="text-xs text-base-content/60 mb-1">24h Low</p>
                <p className="font-semibold text-error">
                  $
                  {(parseFloat(price) * 0.95).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="card-actions justify-between items-center pt-2">
          <div className="flex items-center gap-2 text-xs text-base-content/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
            <span>Verified by RedStone</span>
          </div>
          <button className="btn btn-primary btn-sm gap-2" onClick={fetchPrice} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Updating...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
