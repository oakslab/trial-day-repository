/**
 * Required error message
 * @param fieldName Field name
 * @returns string
 */
export const requiredError = (fieldName: string) => `${fieldName} is required`;

/**
 * Length error message
 * @param fieldName Field name
 * @param minLength Minimum Length of the field
 * @param maxLength Maximum Length of the field
 * @returns string
 */
export const lengthError = (
  fieldName: string,
  minLength: number,
  maxLength?: number,
) => {
  const isSingular = minLength === 1;

  if (maxLength)
    return `${fieldName} must be between ${minLength} and ${maxLength} characters long`;
  return `${fieldName} must be at least ${minLength} ${
    isSingular ? 'character' : 'characters'
  } long`;
};

/**
 * Exact length error message
 * @param fieldName Field name
 * @param length Required length
 * @param unit Unit of the length
 * @returns string
 */
export const exactLengthError = (
  fieldName: string,
  length: number,
  unit = 'characters',
) => `${fieldName} must be ${length} ${unit}`;

/**
 * Parse error message
 * @param fieldName Field name
 * @returns string
 */
export const parseError = (fieldName: string) => `Invalid ${fieldName}`;
