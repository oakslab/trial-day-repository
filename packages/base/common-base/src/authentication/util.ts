import z from 'zod';
import {
  LINE_SEPARATOR,
  REAL_NEW_LINE_SEPARATOR,
} from '../utils/line-separator';

/**
 * The password must have at least one uppercase or lowercase letter,
 * one digit, and one special character from this set (\@|$|!|%|*|#|?|&|.|^)
 */

const STRONG_PASSWORD_REGEX = new RegExp(
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&^.]{8,}$/,
);

const MIN_PASSWORD_LENGTH = 8 as const;

const individualRuleMap = {
  [new RegExp(`.{${MIN_PASSWORD_LENGTH},}`).source]:
    `Is at least ${MIN_PASSWORD_LENGTH} characters long.`,
  [/^(?=.*[A-Z])(?=.*[a-z]).*$/.source]:
    'Contains a mix of uppercase and lowercase letters.',
  [/^(?=.*\d)/.source]: 'Includes at least one numeric digit.',
  [/^(?=.*[@$!%*#?&.])/.source]:
    'Contains at least one special character (e.g., @, #, $, %)',
};

const createWeakPasswordError = (password: string) => {
  return `Password is not strong enough.${LINE_SEPARATOR}${REAL_NEW_LINE_SEPARATOR}${Object.entries(
    individualRuleMap,
  )
    .filter(([rule]) => !new RegExp(rule).test(password))
    .map(([, message]) => `- ${message}`)
    .join(LINE_SEPARATOR + REAL_NEW_LINE_SEPARATOR)}`;
};

export const weakPasswordError = (zodString: z.ZodString) =>
  zodString.refine(
    (data) => STRONG_PASSWORD_REGEX.test(data),
    (data) => ({ message: createWeakPasswordError(data) }),
  );
