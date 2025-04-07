const EMPTY = Symbol("EMPTY");

export const memoizeAsyncOnce = <T>(getValue: () => Promise<T>) => {
  let lastValue: Promise<T> | typeof EMPTY = EMPTY;

  const loadValue = async () => {
    try {
      lastValue = getValue();

      await lastValue;
    } catch (error) {
      lastValue = EMPTY;

      throw error;
    }
  };

  return async () => {
    if (lastValue === EMPTY) {
      await loadValue();
    }

    return (await lastValue) as T;
  };
};
