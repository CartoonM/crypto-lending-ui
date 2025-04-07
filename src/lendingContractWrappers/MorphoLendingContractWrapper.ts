import type { ContractRunner } from "ethers";

import {
  MorphoLendingContractFactory,
  type MorphoLendingContract,
} from "@/smartContracts";

import { BaseLendingContractWrapper } from "./helpers/BaseLendingContractWrapper";

export class MorphoLendingContractWrapper extends BaseLendingContractWrapper<MorphoLendingContract> {
  protected lendingContract: MorphoLendingContract;

  constructor(contractAddress: string, runner?: ContractRunner | null) {
    super(runner);

    this.lendingContract = MorphoLendingContractFactory.connect(
      contractAddress,
      runner
    );
  }

  async redeem(
    shareAssetAmount: bigint,
    ownerAddress: string,
    receiverAddress: string
  ): Promise<string> {
    const tx = await this.lendingContract.redeem(
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
    const tx = await this.lendingContract.withdraw(
      underlyingAssetAmount,
      receiverAddress,
      ownerAddress
    );

    return tx.hash;
  }
}
