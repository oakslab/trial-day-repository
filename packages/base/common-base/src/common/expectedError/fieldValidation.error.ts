import { ExpectedError } from './expected.error';

export class FieldValidationError<TField extends string> extends ExpectedError {
  public readonly field: TField;
  public readonly code = ExpectedError.CodeEnum.FIELD_VALIDATION_ERROR;

  constructor(message: string, field: TField) {
    super(message);
    this.field = field;
  }
}
