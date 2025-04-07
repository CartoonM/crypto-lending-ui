import { useEffect } from "react";
import { useParams } from "react-router";

import { type LendingPlatformId, platformById } from "@/resources";
import { LendingCard } from "@/components/LendingCard";
import { useLendingContracts } from "@/hooks/useLendingContracts";
import { useWallet } from "@/providers/WalletProvider";
import { tryCatchAsync } from "@/utils";

export const LendingPage = () => {
  const { section } = useParams<{ section: LendingPlatformId }>();
  const { chainId, requestChangeChain } = useWallet();

  const platform = section && platformById[section];
  const contracts = useLendingContracts(platform?.id);

  useEffect(() => {
    if (!platform || chainId === platform.chainId) {
      return;
    }

    tryCatchAsync(requestChangeChain(platform.chainId), console.error);
  }, [chainId, platform?.id]);

  if (!platform || !contracts.length) {
    return (
      <div className="mx-auto mt-8 max-w-4xl px-4 text-white">
        <p>No contract found for "{section}"</p>
      </div>
    );
  }

  if (chainId !== platform.chainId) {
    return (
      <div className="mx-auto mt-8 max-w-4xl px-4 text-white">
        <p>
          Please connect wallet or switch to network network with chain id -{" "}
          {platform.chainId}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-4xl px-4">
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-white">{platform.name}</h1>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {contracts.map((contract, index) => (
            <LendingCard
              key={index}
              contract={contract}
              fullWidth={
                contracts.length % 2 !== 0 && index === contracts.length - 1
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
