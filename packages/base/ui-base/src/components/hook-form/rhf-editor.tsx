import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Editor, { EditorProps } from '../editor';
import { RHFFormErrorHelper } from './rhf-error-helper';

// ----------------------------------------------------------------------

interface Props extends EditorProps {
  name: string;
}

export default function RHFEditor({ name, helperText, ...other }: Props) {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  const values = watch();

  useEffect(() => {
    if (values[name] === '<p><br></p>') {
      setValue(name, '', {
        shouldValidate: !isSubmitSuccessful,
      });
    }
  }, [isSubmitSuccessful, name, setValue, values]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Editor
          id={name}
          value={field.value}
          onChange={field.onChange}
          error={!!error}
          helperText={
            <RHFFormErrorHelper error={error} helperText={helperText} />
          }
          {...other}
        />
      )}
    />
  );
}
