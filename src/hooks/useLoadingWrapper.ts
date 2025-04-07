import { useRef, useState } from "react";

import { tryCatchAsync } from "@/utils";

export const useLoadingWrapper = <TArgs extends unknown[], TResult>(
  asyncFn: (...args: TArgs) => Promise<TResult>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingCountRef = useRef(0);

  const withLoading = async (...args: TArgs) => {
    loadingCountRef.current++;
    setIsLoading(true);

    const result = await tryCatchAsync(() => asyncFn(...args));

    loadingCountRef.current--;
    if (loadingCountRef.current === 0) {
      setIsLoading(false);
    }

    return result;
  };

  return [isLoading, withLoading] as const;
};
