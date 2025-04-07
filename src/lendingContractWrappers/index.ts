import type { ContractRunner } from "ethers";

import { LendingPlatformId } from "@/resources";

import { FluidLendingContractWrapper } from "./FluidLendingContractWrapper";
import { MorphoLendingContractWrapper } from "./MorphoLendingContractWrapper";
import { VenusLendingContractWrapper } from "./VenusLendingContractWrapper";
import type { LendingContractWrapper } from "./types";

export type { LendingContractWrapper };

type Params = {
  address: string;
  runner?: ContractRunner | null;
};

export const getLendingContractWrapper = (
  platformId: LendingPlatformId,
  params: Params
): LendingContractWrapper => {
  const args = [params.address, params.runner] as const;
  switch (platformId) {
    case LendingPlatformId.Fluid:
      return new FluidLendingContractWrapper(...args);
    case LendingPlatformId.Morpho:
      return new MorphoLendingContractWrapper(...args);
    case LendingPlatformId.Venus:
      return new VenusLendingContractWrapper(...args);
    default:
      throw new Error(`Unsupported platform: ${platformId}.`);
  }
};
