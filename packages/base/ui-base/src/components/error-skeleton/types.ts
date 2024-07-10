export interface ErrorObj extends Error {
  code?: number;
  data?: {
    code?: string;
    httpStatus?: number;
    path?: string;
  };
}
