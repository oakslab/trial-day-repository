import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';

import { useBoolean } from '../../hooks/use-boolean';
import Iconify from '../iconify';
import { RHFErrorHelper } from './rhf-error-helper';

// ----------------------------------------------------------------------

type Props = Omit<TextFieldProps, 'type'> & {
  name: string;
};

export default function RHFPasswordField({
  name,
  helperText,
  ...other
}: Props) {
  const { control } = useFormContext();
  const useIsEyeToggled = useBoolean();

  const type = useIsEyeToggled.value ? 'text' : 'password';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={field.value}
          onChange={(event) => {
            field.onChange(event.target.value);
          }}
          error={!!error}
          helperText={<RHFErrorHelper error={error} helperText={helperText} />}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={useIsEyeToggled.onToggle} edge="end">
                  <Iconify
                    icon="solar:eye-bold"
                    sx={{
                      display: useIsEyeToggled.value ? 'block' : 'none',
                    }}
                  />
                  <Iconify
                    icon="solar:eye-closed-bold"
                    sx={{
                      display: useIsEyeToggled.value ? 'none' : 'block',
                    }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...other}
        />
      )}
    />
  );
}
