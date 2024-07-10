import { REQUEST_ID_HEADER_NAME } from '@base/common-base/src/constants';
import * as Sentry from '@sentry/nextjs';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import { NextApiRequest, NextApiResponse } from 'next';
import Container from 'typedi';
import { v4 as generateUuidV4 } from 'uuid';
import { LoggerService } from '../services/logger';
import {
  authenticateUserIfTokenExists,
  validateCloudTaskRequest,
} from './auth';
import { RequestContext } from './types';

export const createContext = async ({
  req,
  res,
}: NodeHTTPCreateContextFnOptions<
  NextApiRequest,
  NextApiResponse
>): Promise<RequestContext> => {
  let requestId: string | null = null;
  try {
    // Extract request ID from client
    const requestIdFromClient =
      Object.keys(req.headers).includes(REQUEST_ID_HEADER_NAME) &&
      !Array.isArray(req.headers[REQUEST_ID_HEADER_NAME])
        ? req.headers[REQUEST_ID_HEADER_NAME]
        : undefined;

    requestId = requestIdFromClient || `internal_${generateUuidV4()}`;
    res.setHeader(REQUEST_ID_HEADER_NAME, requestId); // Send the same request ID back to client

    const container = Container.of(requestId);
    container.set('requestId', requestId);

    const isCloudTasksRequest = !!req.headers['x-cloudtasks-queuename'];
    if (isCloudTasksRequest) {
      await validateCloudTaskRequest(req, container);
    }
    const user = !isCloudTasksRequest
      ? await authenticateUserIfTokenExists(req, container)
      : null;

    container.set(LoggerService, new LoggerService(requestId, user));

    return {
      referer: req.headers.referer,
      container,
      user,
      req,
      res,
    };
  } catch (error) {
    const logger = new LoggerService(requestId, null);
    logger.error(`Error creating context for ${req.url}`, { error });
    Sentry.captureException(error);
    throw error;
  }
};
