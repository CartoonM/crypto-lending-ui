import type { EthereumProvider } from "./utils/types";

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
