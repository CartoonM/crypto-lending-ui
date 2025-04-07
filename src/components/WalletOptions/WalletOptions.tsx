import { useState } from "react";

import { useInjectedProviders } from "@/hooks/useInjectedProviders";
import { useWallet } from "@/providers/WalletProvider";
import { Dialog } from "@/components/Dialog";
import { type EthereumProvider, tryCatchAsync } from "@/utils";

import { Button } from "../Button";

export function WalletOptions() {
  const providersDetail = useInjectedProviders();
  const { connectWallet } = useWallet();

  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [loadingProviderId, setLoadingProviderId] = useState<string | null>(
    null
  );

  const handleConnect = async (provider: EthereumProvider, id: string) => {
    setLoadingProviderId(id);
    const [, error] = await tryCatchAsync(connectWallet(provider));
    setLoadingProviderId(null);

    if (error) {
      setIsErrorDialogOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-center sm:justify-end gap-2">
        {providersDetail.map(({ provider, info }) => (
          <Button
            onClick={() => handleConnect(provider, info.uuid)}
            variant="gray"
            key={info.uuid}
            className="flex items-center space-x-2 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loadingProviderId !== null}
          >
            {loadingProviderId === info.uuid ? (
              <span className="animate-spin rounded-full border-2 border-white border-t-transparent h-4 w-4" />
            ) : (
              <img
                src={info.icon}
                className="h-5 w-5 hidden sm:block"
                alt={`${info.name} logo`}
              />
            )}
            <span>{info.name}</span>
          </Button>
        ))}
      </div>

      <Dialog
        title="No active wallet session found"
        description={`It looks like your wallet is installed, but not currently active.
            Please open the wallet extension and ensure you’re logged in or have
            selected an account before trying again.`}
        isOpen={isErrorDialogOpen}
        close={() => setIsErrorDialogOpen(false)}
      />
    </>
  );
}
