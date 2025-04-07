import { useEffect, useState } from "react";

import {
  type InjectedProviderDetails,
  createInjectedProviderCollector,
} from "@/utils/evmProviders";

export const useInjectedProviders = (listenTimeoutMs = 1_000) => {
  const [providers, setProviders] = useState<InjectedProviderDetails[]>([]);

  useEffect(() => {
    const collector = createInjectedProviderCollector((_, providers) => {
      setProviders([...providers]);
    });

    const timeout = setTimeout(() => {
      collector.destroy();
    }, listenTimeoutMs);

    return () => {
      clearTimeout(timeout);
      collector.destroy();
    };
  }, []);

  return providers;
};
