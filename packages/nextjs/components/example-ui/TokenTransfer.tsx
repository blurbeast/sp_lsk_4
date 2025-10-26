"use client";

import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const TokenTransfer = () => {
  const { address: connectedAddress, isConnecting } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const balanceArgs = ([connectedAddress as `0x${string}` | undefined] as const);

  // Get user's token balance
  const { data: tokenBalance } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "balanceOf",
    args: balanceArgs,
    enabled: !!connectedAddress,
  });

  const { data: tokenSymbol } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "symbol",
  });

  const { writeAsync: writeMyTokenAsync, isMining } = useScaffoldContractWrite({
    contractName: "MyToken",
    functionName: "transfer",
    args: [recipient as `0x${string}`, parseEther(amount || "0")],
  });

  const userBalanceFormatted = tokenBalance ? formatEther(tokenBalance) : "0";

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      notification.error("Please fill in all fields");
      return;
    }

    // Validate amount doesn't exceed balance
    try {
      const amountInWei = parseEther(amount);
      if (tokenBalance && amountInWei > tokenBalance) {
        notification.error(`Insufficient balance. You have ${userBalanceFormatted} ${tokenSymbol || "tokens"}`);
        return;
      }
    } catch (error) {
      notification.error("Invalid amount");
      return;
    }

    try {
      await writeMyTokenAsync({
        args: [recipient as `0x${string}`, parseEther(amount)],
      });

      notification.success("Token transfer successful!");
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Transfer failed:", error);
      notification.error("Transfer failed. Please try again.");
    }
  };

  const handleMaxAmount = () => {
    if (tokenBalance) {
      setAmount(userBalanceFormatted);
    }
  };

  if (isConnecting) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Transfer Tokens</h2>
          <div className="flex justify-center items-center gap-2">
            <span className="loading loading-spinner loading-md"></span>
            <span>Connecting wallet...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!connectedAddress) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Transfer Tokens</h2>
          <p>Please connect your wallet to transfer tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Transfer Tokens</h2>

        {/* Display current balance */}
        <div className="alert alert-info">
          <div className="flex flex-col w-full">
            <span className="text-sm">Your Balance:</span>
            <span className="font-bold text-lg">
              {userBalanceFormatted} {tokenSymbol || "tokens"}
            </span>
          </div>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Recipient Address</span>
          </label>
          <input
            type="text"
            placeholder="0x..."
            className="input input-bordered w-full max-w-xs"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Amount</span>
            <button className="btn btn-xs btn-ghost" onClick={handleMaxAmount}>
              MAX
            </button>
          </label>
          <input
            type="number"
            placeholder="0.0"
            className="input input-bordered w-full max-w-xs"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            step="0.0001"
            min="0"
            max={userBalanceFormatted}
          />
        </div>

        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleTransfer} disabled={!recipient || !amount || isMining}>
            {isMining ? <span className="loading loading-spinner loading-sm"></span> : "Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
};
