import { ExpectedErrorCode } from './expected-error-code';

export abstract class ExpectedError {
  public static readonly CodeEnum = ExpectedErrorCode;
  public abstract readonly code: ExpectedErrorCode;
  public readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
