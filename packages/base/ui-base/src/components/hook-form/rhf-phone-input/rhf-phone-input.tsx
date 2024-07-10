import { FormHelperText, Stack, type FormControlProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Controller, useFormContext } from 'react-hook-form';
import PhoneInput, { PhoneInputProps } from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

export type Props = Omit<
  PhoneInputProps,
  'onChange' | 'defaultValue' | 'value'
> &
  Omit<FormControlProps, 'onChange'> & {
    name: string;
    error?: boolean;
    value?: string;
    helperText?: string;
    label?: string;
    normalize?: (phone: string) => string;
  };

const RHFPhoneInput = (props: Props) => {
  const { name, helperText, normalize, label, ...other } = props;
  const { control } = useFormContext();
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={other.defaultValue || ''}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <Stack
          sx={{
            width: '100%',
          }}
        >
          <PhoneInput
            {...other}
            {...field}
            specialLabel={label}
            disableDropdown
            onChange={(value: string) => {
              const normalizedValue = normalize?.(value) || value;
              return field.onChange(normalizedValue);
            }}
            inputStyle={{
              width: '100%',
              borderColor: error
                ? theme.palette.error.main
                : theme.palette.grey[300],
            }}
            inputProps={{
              autoFocus: false,
              name,
              ref,
            }}
            containerStyle={{
              color: error ? theme.palette.error.main : theme.palette.grey[300],
            }}
            searchStyle={{
              border: 'none',
            }}
          />
          {error ? (
            <FormHelperText
              sx={{
                color: theme.palette.error.main,
              }}
            >
              {helperText}
            </FormHelperText>
          ) : null}
        </Stack>
      )}
    />
  );
};

export default RHFPhoneInput;
