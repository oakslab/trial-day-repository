import { useMemo, useCallback, useRef } from 'react';
import { DateRange } from '@base/ui-base/components/custom-date-range-picker';
import {
  DatagridFilterConfig,
  FilterValues as FilterValuesBase,
  DatagridFilters,
  DatagridFiltersRefHandle,
} from '@base/ui-base/components/datagrid';
import isEqual from 'lodash/isEqual';
import mapValues from 'lodash/mapValues';
import { JsonParam, useQueryParam, withDefault } from 'use-query-params';

export type FilterValues = FilterValuesBase;
export type UseFiltersOptions<T extends FilterValues> = DatagridFilterConfig<T>;

export const useFilters = <T extends FilterValues>({
  defaultFilters,
  queryParamName,
}: {
  defaultFilters?: T;
  queryParamName?: string;
}) => {
  const [filters, setFilters] = useQueryParam<T | undefined>(
    queryParamName || 'filters',
    withDefault(JsonParam, defaultFilters),
    {
      removeDefaultsFromUrl: true,
      enableBatching: true,
    },
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters || undefined);
  }, [defaultFilters, setFilters]);

  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  const isDefault = useMemo(() => {
    return isEqual(memoizedFilters, defaultFilters);
  }, [memoizedFilters, defaultFilters]);

  return useMemo(
    () => ({
      filters: memoizedFilters,
      isDefault,
      setFilters,
      resetFilters,
    }),
    [memoizedFilters, isDefault, resetFilters, setFilters],
  );
};

export const useDataGridFilters = <T extends FilterValues>(
  filtersConfig: UseFiltersOptions<T>,
) => {
  const filterNodeRef = useRef<DatagridFiltersRefHandle>(null);
  const defaultFilters = useMemo(() => {
    // const filtersConfig =
    // if (!options || !options.filtersConfig) return null;

    const filters: Record<string, unknown> = {};

    Object.keys(filtersConfig).forEach((key) => {
      const filterConfig = filtersConfig[key];
      if (!filterConfig) return;
      if ('defaultValue' in filterConfig) {
        filters[key] = filterConfig.defaultValue;
      } else if (
        filterConfig.type === 'select' ||
        filterConfig.type === 'autocomplete'
      ) {
        filters[key] = [];
      } else if (filterConfig.type === 'text') {
        filters[key] = '';
      } else if (filterConfig.type === 'tab') {
        filters[key] = undefined;
      } else if (filterConfig.type === 'dateRange') {
        filters[key] = undefined;
      }
    });

    return filters;
  }, [filtersConfig]) as T;

  const {
    filters: rawFilters,
    setFilters,
    resetFilters,
    isDefault,
  } = useFilters<T>({
    defaultFilters,
  });

  const filters = useMemo(
    () =>
      mapValues(rawFilters, (value, key) => {
        const filterConfig = filtersConfig?.[key];
        if (!filterConfig) return value;
        if (filterConfig.type === 'dateRange' && value) {
          const dateRangeValue = value as unknown as {
            start: string;
            end: string;
          };
          return {
            start: new Date(dateRangeValue.start),
            end: new Date(dateRangeValue.end),
          } as DateRange;
        }

        return value;
      }),
    [filtersConfig, rawFilters],
  );

  const handleFilters = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setFilters({
        ...filters,
        [name]: value,
      } as unknown as T);
    },
    [filters, setFilters],
  );

  if (!filtersConfig) return;

  const filtersNode = (
    <DatagridFilters
      filtersRef={filterNodeRef}
      config={filtersConfig as DatagridFilterConfig<FilterValues>}
      filters={(filters || defaultFilters) as unknown as T}
      onFilter={handleFilters}
    />
  );

  const resetFiltersWithRef = useCallback(() => {
    resetFilters();
    filterNodeRef.current?.resetFilterValue();
  }, [resetFilters]);

  return {
    filters,
    filtersNode,
    isDefault,
    dataGridWrapperProps: {
      resetFilters: resetFiltersWithRef,
      filters: filters || defaultFilters,
      filterConfig: filtersConfig as DatagridFilterConfig<FilterValues>,
      handleResetFilters: resetFiltersWithRef,
    },
  };
};
