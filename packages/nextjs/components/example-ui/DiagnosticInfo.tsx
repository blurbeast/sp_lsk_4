"use client";

import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const DiagnosticInfo = () => {
  const { address: connectedAddress, isConnected, isConnecting, isDisconnected } = useAccount();

  const {
    data: tokenBalance,
    isLoading,
    error,
  } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "balanceOf",
    args: [connectedAddress as `0x${string}` | undefined],
  });

  return (
    <div className="card w-full bg-info text-info-content shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title">🔍 Diagnostic Information</h2>
        <div className="space-y-2 text-sm font-mono">
          <p>🔌 Connection Status:</p>
          <div className="ml-4">
            <p>• isConnected: {isConnected ? "✅ Yes" : "❌ No"}</p>
            <p>• isConnecting: {isConnecting ? "🔄 Yes" : "No"}</p>
            <p>• isDisconnected: {isDisconnected ? "Yes" : "No"}</p>
          </div>
          <p>📍 Your Address: {connectedAddress || "❌ Not connected"}</p>
          <p>🔄 Loading Balance: {isLoading ? "Yes" : "No"}</p>
          <p>⚠️ Error: {error ? error.toString() : "None"}</p>
          <p>💰 Token Balance (raw): {tokenBalance?.toString() || "undefined"}</p>
          <p>💰 Token Balance (formatted): {tokenBalance ? (Number(tokenBalance) / 1e18).toFixed(4) : "0"}</p>
        </div>
        {!isConnected && (
          <div className="alert alert-warning mt-4">
            <span>⚠️ Wallet not detected. Please connect your wallet using the button in the header.</span>
          </div>
        )}
      </div>
    </div>
  );
};
