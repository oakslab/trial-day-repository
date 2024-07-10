import { ExpectedError } from './expected.error';

export class ForbiddenError extends ExpectedError {
  public readonly code = ExpectedError.CodeEnum.FORBIDDEN_ERROR;

  constructor(message: string) {
    super(message);
  }
}
