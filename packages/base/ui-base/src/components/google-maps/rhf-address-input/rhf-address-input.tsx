import React, { useEffect, useMemo } from 'react';
import { LocationOn } from '@mui/icons-material';
import { FormHelperText, InputAdornment, Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import * as Sentry from '@sentry/nextjs';
import { Controller, useFormContext } from 'react-hook-form';
import usePlacesAutocomplete, {
  RequestOptions,
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import {
  ADDRESS_RESOLUTION_ERRORS,
  ADDRESS_RESOLUTION_ERROR_MESSAGE,
} from './rhf-address-input.constants';
import { AddressOutput } from './types';

export type RHFAddressProps = {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  /**
   * Enable geocoding to get the coordinates (lat, lon) of the address when selected
   * @default true
   */
  enableGeocoding?: boolean;
  googleMapsRequestOptions?: RequestOptions;
};

const RHFAddressInput = ({
  name,
  label,
  placeholder,
  helperText,
  googleMapsRequestOptions,
  enableGeocoding = true,
}: RHFAddressProps) => {
  const { control, setValue, setError } = useFormContext();
  const {
    ready,
    suggestions: { data, loading, status },
    setValue: setAutocompleteValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: googleMapsRequestOptions,
    debounce: 300,
  });

  const theme = useTheme();

  const options: AddressOutput[] = useMemo(
    () =>
      data.map((option) => ({
        placeId: option.place_id,
        description: option.description,
        suggestion: option,
      })),
    [data],
  );

  useEffect(() => {
    if (status && ADDRESS_RESOLUTION_ERRORS.has(status)) {
      Sentry.captureMessage(
        `RHFAddressInput: Error resolving address using Google Places API: ${status}`,
        'error',
      );
      setError(name, {
        message: ADDRESS_RESOLUTION_ERROR_MESSAGE,
      });
    }
  }, [status]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack
          sx={{
            width: '100%',
          }}
        >
          <Autocomplete<AddressOutput>
            {...field}
            value={field.value === undefined ? null : field.value} // undefined value leads to uncontrolled -> controlled component switch error in console
            id={`autocomplete-${name}`}
            freeSolo={false}
            onInputChange={(_, newValue) => setAutocompleteValue(newValue)}
            onChange={async (_, newValue: AddressOutput | null) => {
              if (!newValue) {
                setValue(name, null);
                clearSuggestions();
                return;
              }

              if (!enableGeocoding) {
                setValue(name, newValue);
                clearSuggestions();
                return;
              }

              try {
                const results = await getGeocode({
                  address: newValue.description,
                });

                if (!results[0]) {
                  throw new Error('No results found');
                }

                const { lat, lng } = getLatLng(results[0]);
                setValue(name, {
                  ...newValue,
                  coordinates: { latitude: lat, longitude: lng },
                });
              } catch (error) {
                setError(name, {
                  message: ADDRESS_RESOLUTION_ERROR_MESSAGE,
                });
                throw error;
              } finally {
                clearSuggestions();
              }
            }}
            options={options}
            getOptionLabel={(option) => option?.description ?? ''}
            isOptionEqualToValue={(option, value) => {
              return option.placeId === value.placeId;
            }}
            loading={!ready || loading}
            noOptionsText="No locations"
            selectOnFocus
            clearOnBlur
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={!!error}
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            )}
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

export default RHFAddressInput;
