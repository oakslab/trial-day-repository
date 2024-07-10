import { useEffect, useRef } from 'react';

export class DependencyChangedError<T> extends Error {
  constructor(
    message: string,
    public previousValue: T,
    public currentValue: T,
  ) {
    super(message);
    this.name = 'DependencyChangedError';
  }
}

export const usePreventChangingBetweenRenders = <T>(
  value: T,
  errorMessage: string,
): T => {
  const previousValueRef = useRef(value);

  useEffect(() => {
    if (previousValueRef.current !== value) {
      throw new DependencyChangedError(
        errorMessage,
        previousValueRef.current,
        value,
      );
    }
  }, [value]);

  return value;
};
