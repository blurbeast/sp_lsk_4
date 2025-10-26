"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const NFTCollection = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  const [mintToAddress, setMintToAddress] = useState("");

  const { data: nftName, isLoading: isLoadingName } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "name",
  });

  const { data: nftSymbol, isLoading: isLoadingSymbol } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "symbol",
  });

  const { data: totalSupply, isLoading: isLoadingSupply } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "totalSupply",
  });

  const {
    data: userBalance,
    isLoading: isLoadingBalance,
    error: balanceError,
  } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "balanceOf",
    args: [connectedAddress as `0x${string}` | undefined],
    enabled: !!connectedAddress,
  });

  const { writeAsync: writeMyNFTAsync } = useScaffoldContractWrite({
    contractName: "MyNFT",
    functionName: "mint",
    args: [connectedAddress as `0x${string}`],
  });

  // Debug logging
  console.log("NFTCollection Debug:", {
    isConnected,
    isConnecting,
    connectedAddress,
    nftName,
    nftSymbol,
    totalSupply: totalSupply?.toString(),
    userBalance: userBalance?.toString(),
    isLoadingBalance,
    balanceError,
  });

  const handleMint = async () => {
    const targetAddress = mintToAddress || connectedAddress;

    if (!targetAddress) {
      notification.error("Please connect wallet or specify address");
      return;
    }

    try {
      await writeMyNFTAsync({
        args: [targetAddress as `0x${string}`],
      });

      notification.success("NFT minted successfully!");
      setMintToAddress("");
    } catch (error) {
      console.error("Mint failed:", error);
      notification.error("Minting failed. Please try again.");
    }
  };

  if (isConnecting) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">NFT Collection</h2>
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
          <h2 className="card-title">NFT Collection</h2>
          <p>Please connect your wallet to view and mint NFTs</p>
        </div>
      </div>
    );
  }

  if (isLoadingName || isLoadingSymbol || isLoadingSupply || isLoadingBalance) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">NFT Collection</h2>
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  if (balanceError) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">NFT Collection</h2>
          <div className="alert alert-error">
            <span>Error loading NFT data. Check console for details.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {nftName || "Loading..."} ({nftSymbol || "..."})
        </h2>

        <div className="stats">
          <div className="stat">
            <div className="stat-title">Total Minted</div>
            <div className="stat-value text-secondary">{totalSupply?.toString() || "0"}</div>
          </div>
          <div className="stat">
            <div className="stat-title">You Own</div>
            <div className="stat-value text-accent">{userBalance?.toString() || "0"}</div>
          </div>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Mint to address (leave empty for yourself)</span>
          </label>
          <input
            type="text"
            placeholder="0x... or leave empty"
            className="input input-bordered w-full max-w-xs"
            value={mintToAddress}
            onChange={e => setMintToAddress(e.target.value)}
          />
        </div>

        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleMint}>
            Mint NFT
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <Address address={connectedAddress} />
        </div>
      </div>
    </div>
  );
};
