import { useEffect, useRef } from 'react';
import { validateSignedUrlExpiration } from '../utils';

export const useSignedUrlExpiration = (
  callback: () => void,
  signedUrl?: string | null,
  interval?: number,
) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!intervalRef.current && signedUrl) {
      intervalRef.current = setInterval(() => {
        validateSignedUrlExpiration(callback, signedUrl);
      }, interval ?? 15000);
    }

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    };
  }, [signedUrl]);
};
