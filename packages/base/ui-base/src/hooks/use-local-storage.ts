import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useLocalStorage<TState>(key: string, initialState: TState) {
  const [state, setState] = useState<TState>(initialState);

  useEffect(() => {
    const restored: TState | null = getStorage<TState>(key);
    if (restored !== null) {
      setState((prevValue) => ({ ...prevValue, ...restored }));
    }
  }, [key]);

  const updateState = useCallback(
    (updateValue: Partial<TState>) => {
      setState((prevValue) => {
        const newValue = { ...prevValue, ...updateValue };
        setStorage(key, newValue);
        return newValue;
      });
    },
    [key],
  );

  const update = useCallback(
    <TName extends keyof TState>(name: TName, updateValue: TState[TName]) => {
      updateState({ [name]: updateValue } as unknown as Partial<TState>);
    },
    [updateState],
  );

  const reset = useCallback(() => {
    removeStorage(key);
    setState(initialState);
  }, [key, initialState]);

  return { state, update, reset };
}

// ----------------------------------------------------------------------

export const getStorage = <T>(key: string): T | null => {
  try {
    const result = window.localStorage.getItem(key);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const setStorage = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export const removeStorage = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};
