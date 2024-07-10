import { useEffect, useRef } from 'react';

export default function useEffectOnce(fn: () => void) {
  const lock = useRef(false);
  useEffect(() => {
    if (!lock.current) {
      lock.current = true;
      fn();
    }
  }, [fn]);
}
