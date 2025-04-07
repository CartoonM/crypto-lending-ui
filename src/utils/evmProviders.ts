import type { EthereumProvider } from "./types";

export interface InjectedProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface InjectedProviderDetails {
  info: InjectedProviderInfo;
  provider: EthereumProvider;
}

const ANNOUNCE_EVENT = "eip6963:announceProvider";
const REQUEST_EVENT = "eip6963:requestProvider";

export const loadInjectedEvmProvider = (
  providerSelector: (details: InjectedProviderDetails) => boolean,
  timeoutMs = 1_000
) =>
  new Promise<InjectedProviderDetails>((resolve, reject) => {
    if (!window?.ethereum) {
      reject(
        new Error(
          "EIP-1193 wallet not found. Need to install a wallet extension."
        )
      );
      return;
    }

    const timeout = setTimeout(() => {
      window.removeEventListener(ANNOUNCE_EVENT, eip6963AnnounceListener);

      reject(
        new Error(`EIP-1193 wallet not found. Timeout after ${timeoutMs}ms.`)
      );
    }, timeoutMs);

    const eip6963AnnounceListener = (event: any) => {
      if (!providerSelector(event.detail)) return;

      resolve(event.detail);

      clearTimeout(timeout);
      window.removeEventListener(ANNOUNCE_EVENT, eip6963AnnounceListener);
    };

    window.addEventListener(ANNOUNCE_EVENT, eip6963AnnounceListener);
    window.dispatchEvent(new Event(REQUEST_EVENT));
  });

type ProviderCallback = (
  provider: InjectedProviderDetails,
  collectedProviders: MapIterator<InjectedProviderDetails>
) => void;

export const createInjectedProviderCollector = (
  onProvider: ProviderCallback
) => {
  const providers = new Map<string, InjectedProviderDetails>();

  const listener = (event: Event) => {
    const { detail } = event as CustomEvent<InjectedProviderDetails>;

    const key = detail.info.uuid;
    if (!providers.has(key)) {
      providers.set(key, detail);
      onProvider(detail, providers.values());
    }
  };

  window.addEventListener(ANNOUNCE_EVENT, listener);
  window.dispatchEvent(new Event(REQUEST_EVENT));

  return {
    getProviders: () => providers.values(),

    destroy: () => {
      window.removeEventListener(ANNOUNCE_EVENT, listener);
    },
  };
};
