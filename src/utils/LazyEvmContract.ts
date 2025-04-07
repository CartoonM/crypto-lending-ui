import type { ContractRunner } from "ethers";

interface Contract {
  runner: ContractRunner | null;
  connect(runner: ContractRunner): this;
}

export class LazyEvmContract<T extends Contract> {
  private contract: T | null = null;
  private contractInitLock: Promise<void> | null = null;

  private dynamicRunner: ContractRunner | null = null;

  constructor(
    private readonly addressFetcher: () => Promise<string>,
    private readonly contractFactory: (address: string) => T
  ) {}

  get target(): T | null {
    return this.contract;
  }

  set runner(runner: ContractRunner) {
    if (this.contract && this.contract.runner !== runner) {
      this.contract = this.contract.connect(runner);
      return;
    }

    this.dynamicRunner = runner;
  }

  public async get(): Promise<T> {
    if (!this.contractInitLock) {
      this.contractInitLock = this.init();
    }

    await this.contractInitLock;
    return this.contract!;
  }

  private async init() {
    if (this.contract) return;

    try {
      const address = await this.addressFetcher();
      this.contract = this.contractFactory(address);
    } catch (error) {
      this.contractInitLock = null;
      this.contract = null;

      throw error;
    }

    if (this.dynamicRunner) {
      this.runner = this.dynamicRunner;
      this.dynamicRunner = null;
    }
  }
}
