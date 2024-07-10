import { ExpectedError } from './expected.error';

export class NotFoundError extends ExpectedError {
  public readonly code = ExpectedError.CodeEnum.NOT_FOUND_ERROR;

  constructor(message: string) {
    super(message);
  }
}
