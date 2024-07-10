import { ExpectedError } from './expected.error';

export class InvalidStateError<TSubCode extends string> extends ExpectedError {
  public readonly code = ExpectedError.CodeEnum.INVALID_STATE_ERROR;

  constructor(
    public readonly subcode: TSubCode,
    message: string,
  ) {
    super(message);
  }
}
