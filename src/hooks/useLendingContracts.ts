import { useMemo } from "react";

import { type LendingPlatformId, platformById } from "@/resources";
import { getLendingContractWrapper } from "@/lendingContractWrappers";
import { useWallet } from "@/providers/WalletProvider";

export const useLendingContracts = (platformId?: LendingPlatformId) => {
  const { provider, signer } = useWallet();

  return useMemo(() => {
    if (!platformId) return [];

    const platform = platformById[platformId];
    return (platform?.contractsInfo ?? []).map(({ address }) =>
      getLendingContractWrapper(platformId, {
        address,
        runner: signer || provider,
      })
    );
  }, [provider, signer, platformId]);
};
