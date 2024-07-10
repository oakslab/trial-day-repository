import { Status } from 'use-places-autocomplete';

export const ADDRESS_RESOLUTION_ERROR_MESSAGE =
  'Failed to resolve address. Please check your input and try again.';

export const ADDRESS_RESOLUTION_ERRORS = new Set<Status>([
  'OVER_QUERY_LIMIT',
  'INVALID_REQUEST',
  'REQUEST_DENIED',
  'UNKNOWN_ERROR',
]);
