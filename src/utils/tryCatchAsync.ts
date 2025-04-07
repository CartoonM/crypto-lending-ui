type ErrorResult = [result: null, error: unknown];
type SuccessResult<T> = [result: T, error: null];
type Result<T> = ErrorResult | SuccessResult<T>;

export const tryCatchAsync = async <T>(
  asyncAction: Promise<T> | (() => Promise<T>),
  onError?: (error: unknown) => void
): Promise<Result<T>> => {
  try {
    const result =
      typeof asyncAction === "function"
        ? await asyncAction()
        : await asyncAction;
    return [result, null];
  } catch (error) {
    onError?.(error);
    return [null, error];
  }
};
