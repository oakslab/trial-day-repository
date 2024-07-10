import { useMemo, useState, useEffect, useCallback } from 'react';
import { useScroll } from 'framer-motion';

// ----------------------------------------------------------------------

type ReturnType = boolean;

interface UseScrollOptions extends Omit<ScrollOptions, 'container' | 'target'> {
  container?: React.RefObject<HTMLElement>;
  target?: React.RefObject<HTMLElement>;
}

export function useOffSetTop(top = 0, options?: UseScrollOptions): ReturnType {
  const { scrollY } = useScroll(options);

  const [value, setValue] = useState(false);

  const onOffSetTop = useCallback(() => {
    scrollY.on('change', (scrollHeight: number) => {
      if (scrollHeight > top) {
        setValue(true);
      } else {
        setValue(false);
      }
    });
  }, [scrollY, top]);

  useEffect(() => {
    onOffSetTop();
  }, [onOffSetTop]);

  return useMemo(() => value, [value]);
}

// Usage
// const offset = useOffSetTop(100);

// Or
// const offset = useOffSetTop(100, {
//   container: ref,
// });
