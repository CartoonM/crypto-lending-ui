import type { ContractRunner } from "ethers";

import { memoizeAsyncOnce } from "@/utils";

import { ERC20UnderlyingAssetMetadataProvider } from "./ERC20UnderlyingAssetMetadataProvider";
import type { LendingContractWrapper } from "../types";

interface LendingContract {
  runner: ContractRunner | null;
  connect(runner: ContractRunner): this;
  asset(): Promise<string>;
  convertToAssets(shareBalance: bigint): Promise<bigint>;
  balanceOf(address: string): Promise<bigint>;
  decimals(): Promise<bigint>;
  symbol(): Promise<string>;
}

export abstract class BaseLendingContractWrapper<
    TContract extends LendingContract
  >
  extends ERC20UnderlyingAssetMetadataProvider
  implements LendingContractWrapper
{
  protected abstract lendingContract: TContract;

  constructor(runner?: ContractRunner | null) {
    super(runner ?? null);
  }

  setRunner(runner: ContractRunner) {
    super.setRunner(runner);

    if (this.lendingContract.runner !== runner) {
      this.lendingContract = this.lendingContract.connect(runner);
    }
  }

  getUnderlyingAssetAddress = memoizeAsyncOnce(() =>
    this.lendingContract.asset()
  );

  getShareAssetSymbol = memoizeAsyncOnce(() => this.lendingContract.symbol());

  getShareAssetDecimals = memoizeAsyncOnce(() =>
    this.lendingContract.decimals()
  );

  async getUnderlyingAssetBalance(address: string): Promise<bigint> {
    const shareBalance = await this.getShareAssetBalance(address);
    return await this.lendingContract.convertToAssets(shareBalance);
  }

  getShareAssetBalance(address: string): Promise<bigint> {
    return this.lendingContract.balanceOf(address);
  }

  abstract redeem(
    shareAssetAmount: bigint,
    ownerAddress: string,
    receiverAddress: string
  ): Promise<string>;

  abstract withdraw(
    underlyingAssetAmount: bigint,
    ownerAddress: string,
    receiverAddress: string
  ): Promise<string>;
}
