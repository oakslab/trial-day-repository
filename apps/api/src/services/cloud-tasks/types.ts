import { google } from '@google-cloud/tasks/build/protos/protos';

export enum HttpTaskType {
  TEST_TYPE = 'TEST_TYPE',
}

export type ITask = google.cloud.tasks.v2.ITask;

export type CreateHttpTaskOptions = {
  type: HttpTaskType;
  delaySeconds?: number;
  payload?: unknown;
};
