import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { Autocomplete } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import debounce from 'lodash/debounce';
import CustomDateRangePicker, {
  DateRange,
  useDateRangePicker,
} from '../custom-date-range-picker';
import Iconify from '../iconify';
import { TabType, TabValue, TabsFilter } from '../tabs-select';
import {
  DatagridFiltersRefHandle,
  AutoCompleteOption,
  DatagridFilterConfig,
  FilterValue,
  FilterConfigBase,
  CustomFilterConfig,
  FilterValues,
} from './datagrid.types';

type Props<
  TConfigBase extends FilterConfigBase,
  TConfig extends DatagridFilterConfig<TConfigBase>,
  TFilters extends FilterValues,
> = {
  config: TConfig;
  filters: TFilters;
  onFilter: <TFilterName extends keyof TFilters = keyof TFilters>(
    name: TFilterName,
    value: TFilters[TFilterName],
  ) => void;
  filtersRef?: React.Ref<DatagridFiltersRefHandle>;
  isLoading?: boolean;
};

export const DatagridFilters = <
  TConfigBase extends FilterConfigBase,
  TConfig extends DatagridFilterConfig<TConfigBase>,
  TFilters extends FilterValues,
>({
  filters,
  config,
  onFilter,
  filtersRef,
}: Props<TConfigBase, TConfig, TFilters>) => {
  const handleFilter = useCallback(
    (name: keyof TFilters & keyof TConfig, value: TFilters[typeof name]) => {
      onFilter(name, value);
    },
    [onFilter],
  );

  // NOTE: this can be extended in the future also will be form
  const renderFilter = (filterName: keyof TFilters & keyof TConfig) => {
    const filterValue = filters[filterName];
    const filterConfig = config[filterName];
    const initialValue = filterConfig?.defaultValue || '';
    const [value, setValue] = useState<
      TFilters[keyof TFilters & keyof TConfig]
    >(
      (filterValue || initialValue) as TFilters[keyof TFilters & keyof TConfig],
    );

    useImperativeHandle(
      filtersRef,
      () => ({
        resetFilterValue: () =>
          setValue(initialValue as TFilters[keyof TFilters & keyof TConfig]),
      }),
      [value],
    );

    const handleFilterDebounced = useCallback(
      debounce(
        (name: keyof TFilters & keyof TConfig, value: TFilters[typeof name]) =>
          handleFilter(name, value),
        300,
      ),
      [handleFilter],
    );

    if (!filterConfig) return null;

    switch (filterConfig.type) {
      case 'select':
        return (
          <FormControl sx={{ width: '100%', flexShrink: 0 }}>
            <InputLabel>{filterConfig.label}</InputLabel>
            <Select
              fullWidth
              multiple
              value={Array.isArray(filterValue) ? filterValue : []}
              onChange={(e) => {
                handleFilter(
                  filterName,
                  e.target.value as TFilters[typeof filterName],
                );
              }}
              input={<OutlinedInput label={filterName as string} />}
              renderValue={(selected) =>
                Array.isArray(selected) ? selected.join(', ') : ''
              }
              MenuProps={{
                PaperProps: {
                  sx: { maxHeight: 240 },
                },
              }}
            >
              {filterConfig.options?.map((option) => (
                <MenuItem key={option.toString()} value={option}>
                  <Checkbox
                    disableRipple
                    size="small"
                    checked={
                      Array.isArray(filterValue) &&
                      filterValue.includes(option.toString())
                    }
                  />
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'text':
        return (
          <TextField
            fullWidth
            defaultValue={
              filterConfig.debounce ? value : (filterValue as string)
            }
            value={filterConfig.debounce ? value : (filterValue as string)}
            onChange={(e) => {
              if (filterConfig.debounce) {
                setValue(
                  e.target.value as TFilters[keyof TFilters & keyof TConfig],
                );
                handleFilterDebounced(
                  filterName,
                  e.target.value as TFilters[keyof TFilters & keyof TConfig],
                );
              } else {
                handleFilter(
                  filterName,
                  e.target.value as TFilters[keyof TFilters & keyof TConfig],
                );
              }
            }}
            placeholder={filterConfig.placeholder ?? filterConfig.label}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: 'text.disabled' }}
                  />
                </InputAdornment>
              ),
            }}
          />
        );
      case 'tab':
        return (
          <TabsFilter
            tabs={filterConfig.tabs as TabType<string>[]}
            value={filterValue?.toString() || ''}
            allowAll={filterConfig.allowAll}
            filterKey={filterName.toString()}
            dataCounts={filterConfig.useCounts?.()}
            onChange={
              handleFilter as (key: string, value: TabValue | undefined) => void
            }
          />
        );
      case 'dateRange': {
        const val = filterValue as DateRange | null;
        const dateRangeArgs = useDateRangePicker({
          start: val?.start || null,
          end: val?.end || null,
        });

        return (
          <>
            <TextField
              fullWidth
              value={dateRangeArgs.label}
              label={filterConfig.label}
              onClick={dateRangeArgs.onOpen}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon="mynaui:calendar"
                      sx={{ color: 'text.disabled' }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            <CustomDateRangePicker
              {...dateRangeArgs}
              variant="calendar"
              title={filterConfig.label}
              onConfirm={(valueRange) => {
                if (filterConfig.debounce) {
                  setValue(
                    valueRange as TFilters[keyof TFilters & keyof TConfig],
                  );
                  handleFilterDebounced(
                    filterName,
                    valueRange as TFilters[keyof TFilters & keyof TConfig],
                  );
                } else {
                  handleFilter(
                    filterName,
                    valueRange as TFilters[keyof TFilters & keyof TConfig],
                  );
                }

                dateRangeArgs.onClose();
              }}
            />
          </>
        );
      }
      case 'autocomplete': {
        const filterValues = filterValue as string[];
        const [inputValue, setInputValue] = useState('');
        const { data, isLoading } = filterConfig.useOptions(inputValue);

        useEffect(() => {
          if (data) {
            filterConfig.__INTERNAL__ = { data: [] };
            filterConfig.__INTERNAL__.data = data || [];
          }
        }, [data, filterConfig]);

        const selectedOptions = useMemo(
          () =>
            data && filterValues
              ? filterValues.map((value) =>
                  data.find((option) => option.value === value),
                )
              : [],
          [data, filterValues],
        );

        return (
          <Autocomplete
            id={`autocomplete-${filterName as string}`}
            limitTags={2}
            multiple
            fullWidth
            loading={isLoading}
            filterSelectedOptions={true}
            options={data || []}
            value={selectedOptions as AutoCompleteOption[]}
            inputValue={inputValue}
            onInputChange={(_, value) => {
              setInputValue(value);
            }}
            onChange={(_, newValue) => {
              handleFilter(
                filterName,
                newValue.map((v) => v.value) as TFilters[keyof TFilters &
                  keyof TConfig],
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label={filterConfig.label} />
            )}
          />
        );
      }
      case 'custom':
        return (filterConfig as CustomFilterConfig<FilterValue>).render(
          filterValue,
          (value) => handleFilter(filterName, value),
        );
      default:
        return null;
    }
  };

  // if there's a tab filter - render it outside of stack first to ensure it's full width
  const tabFilter = Object.keys(config).find(
    (filterName) => config[filterName as keyof TConfig]?.type === 'tab',
  );

  return (
    <>
      {tabFilter && renderFilter(tabFilter as keyof TFilters & keyof TConfig)}
      <Stack
        spacing={2}
        alignItems={{ xs: 'normal', md: 'flex-start' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          p: 2.5,
          display: 'flex', // Ensure the Stack behaves as a flex container
          flexWrap: 'wrap', // Allow items to wrap to the next line
        }}
      >
        {Object.keys(config)
          .filter(
            (filterName) => config[filterName as keyof TConfig]?.type !== 'tab',
          )
          .map((filterName, index) => {
            const filterConfig = config[filterName as keyof TConfig];
            if (!filterConfig?.type) return null;
            return (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={2}
                flexBasis={filterConfig?.width ?? 'auto'}
              >
                {renderFilter(filterName)}
              </Stack>
            );
          })}
      </Stack>
    </>
  );
};
