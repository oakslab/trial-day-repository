import { useMemo } from 'react';
import { DataGridProps } from '@base/ui-base/x-data-grid';
import {
  useDataGridFilters,
  UseFiltersOptions,
  FilterValues as FilterValuesBase,
} from '../use-filters';
import { useList } from '../use-list';
import { BaseEntity, ListQuery } from '../use-list/types';
import { useDataGridPagination } from '../use-pagination';
import { usePreventChangingBetweenRenders } from '../use-prevent-changing-between-renders';
import { useDataGridSorting } from '../use-sorting';

export type { FilterValues } from '@base/ui-base/components/datagrid';

export type UseDataGridOptions<TFilters extends FilterValuesBase> = {
  filtersConfig?: UseFiltersOptions<TFilters>;
};

export type DataGridPropsResult = Omit<DataGridProps, 'columns' | 'loading'>;

export const useDataGrid = <
  TEntity extends BaseEntity,
  TFilters extends FilterValuesBase,
>(
  listQuery: ListQuery<TEntity, TFilters>,
  filtersConfig: UseFiltersOptions<TFilters>,
) => {
  usePreventChangingBetweenRenders(
    filtersConfig,
    `useDataGrid: Changing filtersConfig in-between renders is not supported. Please, provide it as constant part of the initial options.`,
  );

  const filterProps = useDataGridFilters(filtersConfig);

  const { sorting, sortingDataGridProps } = useDataGridSorting();
  const paginationDataGridProps = useDataGridPagination([filterProps?.filters]);

  const options = useMemo(
    () => ({
      filters: filterProps?.filters as TFilters,
      pagination: paginationDataGridProps.paginationModel
        ? {
            page: paginationDataGridProps.paginationModel.page,
            limit: paginationDataGridProps.paginationModel.pageSize,
          }
        : undefined,
      sorting,
    }),
    [filterProps?.filters, paginationDataGridProps, sorting],
  );

  const {
    data,
    isFetching,
    refetch: refetchQuery,
  } = useList(listQuery, options);

  const dataGridProps = useMemo<DataGridPropsResult>(() => {
    return {
      ...paginationDataGridProps,
      ...sortingDataGridProps,
      rows: data?.data?.items ?? [],
      rowCount: data?.data?.count ?? 0,
    };
  }, [
    paginationDataGridProps,
    sortingDataGridProps,
    data?.data?.items,
    data?.data?.count,
  ]);

  const dataGridWrapperProps = useMemo(() => {
    return {
      ...filterProps?.dataGridWrapperProps,
      resultsLength:
        filterProps && !filterProps?.isDefault ? data?.data?.count : undefined,
    };
  }, [
    filterProps?.dataGridWrapperProps,
    filterProps?.isDefault,
    data?.data?.count,
  ]);

  return {
    ...(filterProps ? { ...filterProps } : {}),
    dataGridProps,
    dataGridWrapperProps,
    refetchQuery,
    isFetching,
    data,
  };
};
