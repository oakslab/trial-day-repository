import { CloudTasksClient } from '@google-cloud/tasks';
import { omit } from 'lodash';
import { Service } from 'typedi';
import { apiEnv } from '../../lib/env';
import { LoggerService } from '../logger';
import { CreateHttpTaskOptions, ITask } from './types';

@Service()
export class CloudTasksService {
  private readonly client = new CloudTasksClient();
  private readonly serviceAccountEmail =
    apiEnv.CLOUD_TASKS_SERVICE_ACCOUNT_EMAIL;
  private readonly mainQueueId = apiEnv.MAIN_CLOUD_TASKS_QUEUE;
  private readonly httpTargetUrl = `${apiEnv.API_URL}${apiEnv.CLOUD_TASKS_HANDLER_URL}`;

  constructor(private readonly logger: LoggerService) {}

  private get parent() {
    return this.client.queuePath(
      apiEnv.GOOGLE_CLOUD_PROJECT,
      apiEnv.GOOGLE_CLOUD_REGION,
      this.mainQueueId,
    );
  }

  private constructTaskBody(options: CreateHttpTaskOptions) {
    const payload = omit(options, 'delaySeconds');
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  async createHttpTask(options: CreateHttpTaskOptions): Promise<ITask | null> {
    const task: ITask = {
      httpRequest: {
        headers: {
          'Content-Type': 'application/json',
        },
        httpMethod: 'POST',
        url: this.httpTargetUrl,
        oidcToken: {
          serviceAccountEmail: this.serviceAccountEmail,
        },
        body: this.constructTaskBody(options),
      },
      ...(options.delaySeconds && {
        scheduleTime: {
          seconds: options.delaySeconds + Date.now() / 1000,
        },
      }),
    };

    const request = { parent: this.parent, task: task };

    try {
      this.logger.info('Sending task:', {
        task,
      });
      const [response] = await this.client.createTask(request);
      this.logger.info(`Task ${response.name} created successfully`);
      return response;
    } catch (error) {
      this.logger.error('Task could not be created', { request, error });
      return null;
    }
  }
}
