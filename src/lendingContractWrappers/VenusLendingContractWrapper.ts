import type { ContractRunner } from "ethers";

import {
  VenusLendingContractFactory,
  type VenusLendingContract,
} from "@/smartContracts";
import { memoizeAsyncOnce } from "@/utils";

import { ERC20UnderlyingAssetMetadataProvider } from "./helpers/ERC20UnderlyingAssetMetadataProvider";
import type { LendingContractWrapper } from "./types";

export class VenusLendingContractWrapper
  extends ERC20UnderlyingAssetMetadataProvider
  implements LendingContractWrapper
{
  private lendingContract: VenusLendingContract;

  constructor(contractAddress: string, runner?: ContractRunner | null) {
    super(runner ?? null);

    this.lendingContract = VenusLendingContractFactory.connect(
      contractAddress,
      runner
    );
  }

  setRunner(runner: ContractRunner) {
    super.setRunner(runner);

    if (this.lendingContract.runner !== runner) {
      this.lendingContract = this.lendingContract.connect(runner);
    }
  }

  getUnderlyingAssetAddress = memoizeAsyncOnce(() =>
    this.lendingContract.underlying()
  );

  getShareAssetSymbol = memoizeAsyncOnce(() => this.lendingContract.symbol());

  getShareAssetDecimals = memoizeAsyncOnce(() =>
    this.lendingContract.decimals()
  );

  getUnderlyingAssetBalance(address: string): Promise<bigint> {
    return this.lendingContract.balanceOfUnderlying.staticCall(address);
  }

  getShareAssetBalance(address: string) {
    return this.lendingContract.balanceOf(address);
  }

  async redeem(shareAssetAmount: bigint): Promise<string> {
    const tx = await this.lendingContract.redeem(shareAssetAmount);
    return tx.hash;
  }

  async withdraw(underlyingAssetAmount: bigint): Promise<string> {
    const tx = await this.lendingContract.redeemUnderlying(
      underlyingAssetAmount
    );
    return tx.hash;
  }
}
