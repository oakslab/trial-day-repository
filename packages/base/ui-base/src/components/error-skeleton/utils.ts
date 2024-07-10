import { type ErrorObj } from './types';

export const getDefaultTitle = (error: ErrorObj) => {
  switch (error?.data?.httpStatus) {
    case 401:
    case 403:
      return 'Unauthorized Error';
    case 404:
      return 'Not Found Error';
    default:
      return 'Unexpected Error';
  }
};

export const showStatusCode = (error: ErrorObj) => {
  const statusCode = error?.data?.httpStatus;
  return statusCode && statusCode > 299 && statusCode !== 443;
};

export const getDefaultSubtitle = (error: ErrorObj) => {
  switch (error?.data?.httpStatus) {
    case 401:
    case 403:
      return 'You do not have the permission to perform this action';
    case 404:
      return 'The data you requested does not exist';
    default:
      return 'Something went wrong';
  }
};
