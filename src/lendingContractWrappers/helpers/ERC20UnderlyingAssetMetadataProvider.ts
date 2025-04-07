import type { ContractRunner } from "ethers";

import { ERC20ContractFactory, type ERC20Contract } from "@/smartContracts";
import { LazyEvmContract } from "@/utils/LazyEvmContract";
import { memoizeAsyncOnce } from "@/utils";

export abstract class ERC20UnderlyingAssetMetadataProvider {
  private underlyingAssetContract: LazyEvmContract<ERC20Contract>;

  constructor(runner: ContractRunner | null) {
    this.underlyingAssetContract = new LazyEvmContract(
      () => this.getUnderlyingAssetAddress(),
      (address) => ERC20ContractFactory.connect(address, runner)
    );
  }

  public abstract getUnderlyingAssetAddress(): Promise<string>;

  public setRunner(runner: ContractRunner) {
    this.underlyingAssetContract.runner = runner;
  }

  public getUnderlyingAssetSymbol = memoizeAsyncOnce(async () =>
    (await this.underlyingAssetContract.get()).symbol()
  );

  public getUnderlyingAssetDecimals = memoizeAsyncOnce(async () =>
    (await this.underlyingAssetContract.get()).decimals()
  );
}
