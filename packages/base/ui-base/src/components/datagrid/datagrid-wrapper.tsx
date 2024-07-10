import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Stack, TableContainer, Typography } from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { BlurLoader } from '../blur-loader';
import { DatagridEmptySkeleton } from './datagrid-empty-skeleton';
import DatagridFiltersResult from './datagrid-filter-results';
import type {
  DatagridFilterConfig,
  FilterConfigBase,
  FilterValue,
  FilterValues,
} from './datagrid.types';
import { applyShadowsToScroller } from './utils';

const createDefaultDataGridProps: (
  overrideProps: DataGridProps,
) => Partial<DataGridProps> = (overrideProps) => ({
  autoHeight: true,
  disableRowSelectionOnClick: true,
  sortModel: undefined,
  disableColumnMenu: true,
  disableColumnSorting: true,
  rowHeight: 76,
  disableColumnReorder: true,
  disableColumnResize: true,
  checkboxSelection: true,
  // pagination: true,
  rowSelection: false,
  // paginationMode: 'server',
  sortingMode: 'server',
  slots: {
    noRowsOverlay: () =>
      overrideProps.loading || overrideProps.rows?.length ? (
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          py={2}
        >
          <DatagridEmptySkeleton columns={overrideProps.columns} />
        </Stack>
      ) : (
        <Stack height={200} justifyContent="center" alignItems="center">
          <Typography>No results found</Typography>
        </Stack>
      ),
  },
});

export const DatagridWrapper = <
  TConfigBase extends FilterConfigBase,
  TConfig extends DatagridFilterConfig<TConfigBase>,
  TFilters extends {
    [K in keyof TConfig]: FilterValue;
  },
>({
  dataGridProps,
  filters,
  filterConfig,
  handleResetFilters,
  resultsLength,
  isLoading,
}: {
  dataGridProps: Omit<DataGridProps, 'loading'>;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  filters?: TFilters;
  filterConfig?: TConfig;
  handleResetFilters?: () => void;
  resultsLength?: number;
}) => {
  const mergedDataGridProps: DataGridProps = useMemo(
    () => ({
      ...createDefaultDataGridProps(dataGridProps),
      ...dataGridProps,
      loading: false,
    }),
    [dataGridProps],
  );

  const tableRef = useRef<HTMLDivElement>(null);

  const elementRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Keep track of the size of the element to re-render the shadow effect
  useEffect(() => {
    const element = elementRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (element) {
      resizeObserver.observe(element);
    }

    return () => {
      if (element) {
        resizeObserver.unobserve(element);
      }
    };
  }, []);

  // Shadow effect when table is scrollable:
  useLayoutEffect(() => {
    if (!tableRef.current) return;

    const virtualScrollers = tableRef.current.querySelectorAll<HTMLDivElement>(
      '.MuiDataGrid-virtualScroller',
    );
    const subscribed: (() => void)[] = [];
    for (const virtualScroller of virtualScrollers) {
      applyShadowsToScroller(virtualScroller);
      const scrollHandler = () => {
        applyShadowsToScroller(virtualScroller);
      };
      subscribed.push(scrollHandler);
      virtualScroller.addEventListener('scroll', scrollHandler, false);
    }
    return () => {
      for (const virtualScroller of virtualScrollers) {
        const scrollHandler = subscribed.pop();
        if (!scrollHandler) continue;
        virtualScroller.removeEventListener('scroll', scrollHandler);
      }
    };
  }, [tableRef.current, size.width]);

  return (
    <>
      {filters && filterConfig && (
        <DatagridFiltersResult
          config={filterConfig as unknown as DatagridFilterConfig<FilterValues>}
          filters={filters}
          onResetFilters={() => handleResetFilters && handleResetFilters()}
          results={resultsLength}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
      <TableContainer sx={{ overflow: 'unset' }} ref={elementRef}>
        <BlurLoader isLoading={isLoading}>
          <DataGrid
            {...mergedDataGridProps}
            ref={tableRef}
            className={
              isLoading && !dataGridProps.rows?.length
                ? 'MuiDataGrid-root-loading'
                : undefined
            }
          />
        </BlurLoader>
      </TableContainer>
    </>
  );
};
