import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { type Signer, BrowserProvider } from "ethers";

import { type EthereumProvider, toTruncatedDecimal } from "@/utils";

interface WalletState {
  address: string | null;
  provider: BrowserProvider | null;
  signer: Signer | null;
  chainId: number | null;
  balance: string;
}

interface WalletContextType extends WalletState {
  connectWallet: (provider: EthereumProvider) => Promise<void>;
  requestChangeChain: (chainId: number) => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const [rawProvider, setRawProvider] = useState<EthereumProvider | null>(null);

  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    provider: null,
    signer: null,
    chainId: null,
    balance: "",
  });

  const connectWallet = async (rawProvider: EthereumProvider) => {
    const provider = new BrowserProvider(rawProvider);
    const [selectedAddress] = await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    setRawProvider(rawProvider);

    const rawBalance = await provider.getBalance(selectedAddress);
    const balance = toTruncatedDecimal(rawBalance, 18, 4);

    setWalletState({
      address: selectedAddress,
      provider,
      signer,
      chainId: Number(network.chainId),
      balance,
    });

    loadBalance(provider, selectedAddress);
  };

  const disconnectWallet = () => {
    setRawProvider(null);
    setWalletState({
      address: null,
      provider: null,
      signer: null,
      chainId: null,
      balance: "",
    });
  };

  const loadBalance = async (provider: BrowserProvider, address: string) => {
    try {
      const rawBalance = await provider.getBalance(address);
      const balance = toTruncatedDecimal(rawBalance, 18, 4);

      setWalletState((prev) => ({
        ...prev,
        balance,
      }));
    } catch (e) {
      console.error("Failed to fetch balance:", e);
    }
  };

  useEffect(() => {
    if (!rawProvider) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts.length) {
        disconnectWallet();
        return;
      }

      setWalletState((prev) => ({
        ...prev,
        address: accounts[0],
      }));
      if (walletState.provider) {
        loadBalance(walletState.provider, accounts[0]);
      }
    };

    const handleChainChanged = () => {
      connectWallet(rawProvider);
    };

    rawProvider.on("accountsChanged", handleAccountsChanged);
    rawProvider.on("chainChanged", handleChainChanged);

    return () => {
      rawProvider.removeListener("accountsChanged", handleAccountsChanged);
      rawProvider.removeListener("chainChanged", handleChainChanged);
    };
  }, [rawProvider]);

  const requestChangeChain = async (chainId: number) => {
    if (!rawProvider) return;

    await rawProvider.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x" + chainId.toString(16),
        },
      ],
    });

    await connectWallet(rawProvider);
  };

  return (
    <WalletContext.Provider
      value={{
        ...walletState,
        connectWallet,
        disconnectWallet,
        requestChangeChain,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};
