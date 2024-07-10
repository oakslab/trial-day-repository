import { router } from '../../trpc';
import { runEndpoint } from '../../trpc/adapter';
import { publicProcedure } from '../../trpc/procedures';
import { TaskCreateEndpoint, createTaskInput } from './task-create.endpoint';

export const examplesRouter = router({
  createTask: publicProcedure
    .input(createTaskInput)
    .mutation(
      runEndpoint(TaskCreateEndpoint, (endpoint, { input }) =>
        endpoint.execute(input),
      ),
    ),
  taskHandler: publicProcedure.mutation(({ ctx }) => {
    return { status: 200, message: 'OK', payload: ctx.req.body };
  }),
});
