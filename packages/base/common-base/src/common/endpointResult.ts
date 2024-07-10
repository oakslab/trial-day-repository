import { ExpectedError } from './expectedError';

export type ErrorResult<TError extends ExpectedError> = {
  result: 'error';
  error: TError;
};

export const Result = {
  success: <TData>(data: TData) =>
    ({
      result: 'success',
      data,
    }) as const,
  error: <TError extends ExpectedError>(error: TError) =>
    ({
      result: 'error',
      error,
    }) as const satisfies ErrorResult<TError>,
};
