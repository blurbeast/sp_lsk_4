"use client";

import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const TokenBalance = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();

  const balanceArgs = ([connectedAddress as `0x${string}` | undefined] as const);

  const {
    data: tokenBalance,
    isLoading: isLoadingBalance,
    error: balanceError,
  } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "balanceOf",
    args: balanceArgs,
    enabled: !!connectedAddress, // Only fetch when address is available
  });

  const { data: tokenSymbol, isLoading: isLoadingSymbol } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "symbol",
  });

  const { data: tokenName, isLoading: isLoadingName } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "name",
  });

  const { data: tokenDecimals } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "decimals",
  });

  // Debug logging
  console.log("TokenBalance Debug:", {
    isConnected,
    isConnecting,
    connectedAddress,
    tokenBalance: tokenBalance?.toString(),
    tokenName,
    tokenSymbol,
    tokenDecimals,
    isLoadingBalance,
    isLoadingSymbol,
    isLoadingName,
    balanceError: balanceError?.toString(),
  });

  if (isConnecting) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Token Balance</h2>
          <div className="flex justify-center items-center gap-2">
            <span className="loading loading-spinner loading-md"></span>
            <span>Connecting wallet...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected || !connectedAddress) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Token Balance</h2>
          <p>Please connect your wallet to view token balance</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const isLoading = isLoadingBalance || isLoadingSymbol || isLoadingName;

  if (balanceError) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Token Balance</h2>
          <div className="alert alert-error">
            <div className="flex flex-col">
              <span>Error loading balance</span>
              <span className="text-xs">{balanceError.toString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format the balance
  let formattedBalance = "0.0000";
  if (tokenBalance !== undefined) {
    try {
      formattedBalance = parseFloat(formatEther(tokenBalance)).toFixed(4);
    } catch (e) {
      console.error("Error formatting balance:", e);
      formattedBalance = (Number(tokenBalance) / 1e18).toFixed(4);
    }
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {isLoading ? (
            <span className="loading loading-dots loading-sm"></span>
          ) : (
            <>
              {tokenName || "MyToken"} ({tokenSymbol || "MTK"})
            </>
          )}
        </h2>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Your Balance</div>
            <div className="stat-value text-primary">
              {isLoading ? <span className="loading loading-spinner loading-md"></span> : formattedBalance}
            </div>
            <div className="stat-desc">{tokenSymbol || "tokens"}</div>
          </div>
        </div>
        <div className="card-actions justify-end mt-2">
          <Address address={connectedAddress} />
        </div>
      </div>
    </div>
  );
};
