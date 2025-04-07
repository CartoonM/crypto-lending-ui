import { useWallet } from "@/providers/WalletProvider";

import { Button } from "../Button";
import { ShortenAddress } from "../ShortenAddress";
import { WalletOptions } from "../WalletOptions";

export const WalletConnector = () => {
  const { address, balance, disconnectWallet } = useWallet();

  return address ? (
    <div className="flex items-center justify-center space-x-3">
      <div className="flex items-center rounded-full bg-gray-700 px-4 py-2">
        <span className="text-sm font-medium text-white">{balance} ETH</span>
      </div>

      <ShortenAddress address={address} />

      <Button onClick={disconnectWallet} variant="secondary">
        Disconnect
      </Button>
    </div>
  ) : (
    <WalletOptions />
  );
};
