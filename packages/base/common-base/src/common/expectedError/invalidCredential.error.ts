import { ExpectedError } from './expected.error';

export class InvalidCredentialError extends ExpectedError {
  public readonly code = ExpectedError.CodeEnum.INVALID_CREDENTIAL_ERROR;

  constructor(message: string) {
    super(message);
  }
}
