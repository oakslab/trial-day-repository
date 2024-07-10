import { Prisma } from 'database';

const PrismaCodes = {
  UNIQUE_KEY_VIOLATION: 'P2002',
  NOT_FOUND: 'P2025',
} as const;

/**
 * Type definition for error handler function.
 *
 * @template TErrorResult - The type of the error result.
 * @param {unknown} errorFromCatch - The error caught in the catch block.
 * @returns {TErrorResult | undefined} - The error result or undefined.
 */
type ErrorHandler<TErrorResult> = (
  errorFromCatch: unknown,
) => TErrorResult | undefined;

/**
 * Creates an error handler for duplicate key violations.
 *
 * @template TErrorResult - The type of the error result.
 * @param {TErrorResult} errorResult - The result to return for this error.
 * @returns {ErrorHandler<TErrorResult>} - The error handler function.
 *
 * @example
 * // Use as part of catchAndThrowIfNotExpected
 * // ... your endpoint logic ...
 *  try {
 *    await this.myRepo.create(input);
 *  } catch (e) {
 *    return catchAndThrowIfNotExpected(
 *      uniqueKeyViolation(Result.error(MyErrors.DUPLICATE_KEY)),
 *    )
 *  }
 *  // ... continue with your endpoint logic ...
 *
 * @see {@link catchAndThrowIfNotExpected}
 */
export const uniqueKeyViolation =
  <TErrorResult>(errorResult: TErrorResult): ErrorHandler<TErrorResult> =>
  (errorFromCatch: unknown) =>
    errorFromCatch instanceof Prisma.PrismaClientKnownRequestError &&
    errorFromCatch.code === PrismaCodes.UNIQUE_KEY_VIOLATION
      ? errorResult
      : undefined;

/**
 * Creates an error handler for not found errors.
 *
 * @template TErrorResult - The type of the error result.
 * @param {TErrorResult} errorResult - The result to return for this error.
 * @returns {ErrorHandler<TErrorResult>} - The error handler function.
 *
 * @example
 * // Use as part of catchAndThrowIfNotExpected
 * // ... your endpoint logic ...
 *  try {
 *    await this.myRepo.update(input);
 *  } catch (e) {
 *    return catchAndThrowIfNotExpected(
 *      notFound(Result.error(MyErrors.NOT_FOUND)),
 *    )
 *  }
 *  // ... continue with your endpoint logic ...
 *
 * @see {@link catchAndThrowIfNotExpected}
 */
export const notFound =
  <TErrorResult>(errorResult: TErrorResult): ErrorHandler<TErrorResult> =>
  (errorFromCatch: unknown) =>
    errorFromCatch instanceof Prisma.PrismaClientKnownRequestError &&
    errorFromCatch.code === PrismaCodes.NOT_FOUND
      ? errorResult
      : undefined;

/**
 * Infers the result type from the error handler.
 *
 * @template T - The error handler type.
 * @returns {TErrorResult} - The inferred error result type.
 */
type InferErrorResult<T> = T extends ErrorHandler<infer R> ? R : never;

/**
 * Chains multiple error handlers to handle errors sequentially.
 *
 * @template TErrorResult - The type of the error result.
 * @param {...ErrorHandler<TErrorResult>[]} errorHandlers - The error handlers to chain.
 * @returns {(errorFromCatch: unknown) => TErrorResult | undefined} - The chained error handler function.
 *
 * @example
 * ```typescript
 * try {
 *  await this.myRepo.update(input);
 * } catch (e) {
 *  const errorResult = chainErrors(
 *     notFound(Result.error(MyErrors.NOT_FOUND)),
 *     uniqueKeyViolation(Result.error(MyErrors.DUPLICATE_KEY))
 *  )(e);
 *
 *  if(errorResult) {
 *    // do something with expected error
 *  }
 *
 *  // throw an unexpected error
 *  throw e;
 * }
 * ```
 */
export const chainErrors =
  <TErrorResult>(...errorHandlers: ErrorHandler<TErrorResult>[]) =>
  (errorFromCatch: unknown): TErrorResult | undefined => {
    for (const errorHandler of errorHandlers) {
      const errorResult = errorHandler(errorFromCatch);
      if (errorResult !== undefined) {
        return errorResult;
      }
    }
    return undefined;
  };

/**
 * Catches and throws errors if not known.
 *
 * @template TErrorHandlers - The error handlers array type.
 * @template TErrorResults - The inferred union type of all error results.
 * @param {...TErrorHandlers} errorHandlers - The error handlers to chain.
 * @returns {(errorFromCatch: unknown) => TErrorResults} - The function to handle errors.
 *
 * @example
 * ```typescript
 *  // ... your endpoint logic ...
 *  try {
 *    await this.myRepo.update(input);
 *  } catch (e) {
 *    return catchAndThrowIfNotExpected(
 *      notFound(Result.error(MyErrors.NOT_FOUND)),
 *      uniqueKeyViolation(Result.error(MyErrors.EMAIL_EXISTS))
 *    )
 *  }
 *  // ... continue with your endpoint logic ...
 * ```
 */
export const catchAndThrowIfNotExpected =
  <
    TErrorHandlers extends ErrorHandler<unknown>[],
    TErrorResults extends InferErrorResult<
      TErrorHandlers[number]
    > = InferErrorResult<TErrorHandlers[number]>,
  >(
    ...errorHandlers: TErrorHandlers
  ) =>
  (errorFromCatch: unknown): TErrorResults => {
    const errorResult = chainErrors(...errorHandlers)(errorFromCatch);
    if (errorResult !== undefined) {
      return errorResult as TErrorResults;
    }

    throw errorFromCatch;
  };
