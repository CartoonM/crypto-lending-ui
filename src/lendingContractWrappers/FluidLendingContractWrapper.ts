import type { ContractRunner } from "ethers";

import {
  FluidLendingContractFactory,
  type FluidLendingContract,
} from "@/smartContracts";

import { BaseLendingContractWrapper } from "./helpers/BaseLendingContractWrapper";

export class FluidLendingContractWrapper extends BaseLendingContractWrapper<FluidLendingContract> {
  protected lendingContract: FluidLendingContract;

  constructor(contractAddress: string, runner?: ContractRunner | null) {
    super(runner);

    this.lendingContract = FluidLendingContractFactory.connect(
      contractAddress,
      runner
    );
  }

  async redeem(
    shareAssetAmount: bigint,
    ownerAddress: string,
    receiverAddress: string
  ): Promise<string> {
    const tx = await this.lendingContract["redeem(uint256,address,address)"](
      shareAssetAmount,
      receiverAddress,
      ownerAddress
    );

    return tx.hash;
  }

  async withdraw(
    underlyingAssetAmount: bigint,
    ownerAddress: string,
    receiverAddress: string
  ): Promise<string> {
    const tx = await this.lendingContract["withdraw(uint256,address,address)"](
      underlyingAssetAmount,
      receiverAddress,
      ownerAddress
    );

    return tx.hash;
  }
}
