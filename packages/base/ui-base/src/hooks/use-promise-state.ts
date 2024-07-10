import { useEffect, useState } from 'react';

type PromiseState<T> =
  | { status: 'pending' }
  | { status: 'resolved'; value: T }
  | { status: 'rejected'; error: unknown };

export const usePromiseState = <T>(
  promise: Promise<T> | (() => Promise<T>),
) => {
  const [state, setState] = useState<PromiseState<T>>({
    status: 'pending',
  });

  useEffect(() => {
    let isMounted = true;

    (typeof promise === 'function' ? promise() : promise)
      .then((value) => {
        if (isMounted) {
          setState({
            status: 'resolved',
            value,
          });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setState({
            status: 'rejected',
            error,
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [promise]);

  return state;
};
