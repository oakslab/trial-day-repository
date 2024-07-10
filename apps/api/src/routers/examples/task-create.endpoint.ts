import { Result } from '@base/common-base';
import { Service } from 'typedi';
import { z } from 'zod';
import { CloudTasksService, HttpTaskType } from '../../services';

export const createTaskInput = z.object({
  message: z.string().min(1, 'Message is required'),
  delaySeconds: z.number().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskInput>;

@Service()
export class TaskCreateEndpoint {
  constructor(private readonly taskService: CloudTasksService) {}

  async execute(input: CreateTaskInput) {
    await this.taskService.createHttpTask({
      type: HttpTaskType.TEST_TYPE,
      delaySeconds: input.delaySeconds,
      payload: { message: input.message },
    });

    return Result.success('success');
  }
}
