import { LINE_SEPARATOR } from '@base/common-base/src/utils/line-separator';
import { FormHelperText, type TextFieldProps } from '@mui/material';
import { Fragment } from 'react/jsx-runtime';
import type { FieldError } from 'react-hook-form';

interface RHFErrorHelper {
  error?: FieldError;
  helperText: TextFieldProps['helperText'];
}

export function RHFErrorHelper({ error, helperText }: RHFErrorHelper) {
  if (!error) {
    return <>{helperText}</>;
  }

  const text = error.message?.split(LINE_SEPARATOR) ?? [];

  if (text.length === 1) {
    return text[0];
  }

  return (
    <div style={{ lineHeight: '0.7em' }}>
      {text.map((item, index) => (
        <Fragment key={index}>
          {item}
          <br />
        </Fragment>
      ))}
    </div>
  );
}

export function RHFFormErrorHelper({ error, helperText }: RHFErrorHelper) {
  return (
    <>
      {(!!error || helperText) && (
        <FormHelperText error={!!error} sx={{ px: 2 }}>
          <RHFErrorHelper error={error} helperText={helperText} />
        </FormHelperText>
      )}
    </>
  );
}
