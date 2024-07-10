import { ExpectedError } from './expected.error';
import { FieldValidationError } from './fieldValidation.error';

export class MultiFieldValidationError extends ExpectedError {
  public readonly errors: FieldValidationError<string>[];
  public readonly code = ExpectedError.CodeEnum.MULTIFIELD_VALIDATION_ERROR;

  constructor(
    errors: FieldValidationError<string>[] = [],
    message: string = 'The following fields are invalid',
  ) {
    super(message);
    this.errors = errors;
  }

  public addError(
    error: FieldValidationError<string> | FieldValidationError<string>[],
  ) {
    if (Array.isArray(error)) {
      this.errors.push(...error);
    } else {
      this.errors.push(error);
    }
  }
}
