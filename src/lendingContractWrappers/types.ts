import type { ContractRunner } from "ethers";

export interface LendingContractWrapper {
  setRunner(runner: ContractRunner): void;

  getUnderlyingAssetAddress(): Promise<string>;
  getUnderlyingAssetBalance(address: string): Promise<bigint>;
  getUnderlyingAssetSymbol(): Promise<string>;
  getUnderlyingAssetDecimals(): Promise<bigint>;

  getShareAssetBalance(address: string): Promise<bigint>;
  getShareAssetSymbol(): Promise<string>;
  getShareAssetDecimals(): Promise<bigint>;

  redeem(
    shareAssetAmount: bigint,
    ownerAddress: string,
    receiverAddress: string
  ): Promise<string>;
  withdraw(
    underlyingAssetAmount: bigint,
    ownerAddress: string,
    receiverAddress: string
  ): Promise<string>;
}
