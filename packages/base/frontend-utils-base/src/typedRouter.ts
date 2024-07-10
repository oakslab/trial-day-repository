import { useRouter } from 'next/router';
import type { z } from 'zod';

export const useTypedRouter = <T extends z.Schema>(
  schema: T,
): ReturnType<typeof useRouter> & {
  query: z.infer<T>;
} => {
  const { query, ...router } = useRouter();

  return {
    query: {
      ...query,
      ...(schema.parse(query) as z.infer<T>),
    },
    ...router,
  };
};
