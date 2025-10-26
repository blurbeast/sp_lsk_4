"use client";

import type { NextPage } from "next";
import { NFTCollection } from "~~/components/example-ui/NFTCollection";
import { TokenBalance } from "~~/components/example-ui/TokenBalance";
import { TokenTransfer } from "~~/components/example-ui/TokenTransfer";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 mb-8">
          <h1 className="text-4xl font-bold text-center">My Web3 DApp</h1>
          <p className="text-center mt-2 text-lg">Interact with your ERC20 Token and NFT Collection</p>
        </div>

        <div className="flex-grow bg-base-300 w-full px-8 py-12">
          <div className="flex justify-center items-start gap-6 flex-col lg:flex-row flex-wrap">
            <div className="flex flex-col">
              <TokenBalance />
            </div>
            <div className="flex flex-col">
              <TokenTransfer />
            </div>
            <div className="flex flex-col">
              <NFTCollection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
