import { router } from '../../trpc';
import { publicProcedure } from '../../trpc/procedures';

export const healthRouter = router({
  status: publicProcedure.query(async () => {
    return { date: new Date() };
  }),
});
