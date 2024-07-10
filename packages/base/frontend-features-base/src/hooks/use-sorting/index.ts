import { useCallback, useMemo } from 'react';
import { SortDirectionEnum } from '@base/common-base';

import {
  DataGridProps,
  GridSortModel,
} from '@base/ui-base/components/datagrid';
import {
  StringParam,
  withDefault,
  useQueryParams,
  createEnumParam,
} from 'use-query-params';

export const useSorting = () => {
  const [sorting, setSorting] = useQueryParams(
    {
      column: withDefault(StringParam, null),
      direction: withDefault(
        createEnumParam([SortDirectionEnum.asc, SortDirectionEnum.desc]),
        null,
      ),
    },
    {
      removeDefaultsFromUrl: true,
      enableBatching: true,
    },
  );

  const onSort = (column: string) => {
    if (sorting.column === column) {
      if (sorting.direction === SortDirectionEnum.asc) {
        setSorting({
          column: column,
          direction: SortDirectionEnum.desc,
        });
      } else {
        setSorting({
          column: null,
          direction: null,
        });
      }
    } else {
      setSorting({
        column: column,
        direction: SortDirectionEnum.asc,
      });
    }
  };

  return {
    sorting,
    onSort,
    setSorting,
  };
};

export type Sorting = ReturnType<typeof useSorting>['sorting'];

export const useDataGridSorting = () => {
  const { sorting, setSorting } = useSorting();

  const onSortModelChange = useCallback((sortModel: GridSortModel) => {
    if (!sortModel[0]) {
      return setSorting({ column: null, direction: null });
    }

    setSorting({
      column: sortModel[0].field,
      direction: (sortModel[0].sort || null) as
        | (typeof SortDirectionEnum)[keyof typeof SortDirectionEnum]
        | null,
    });
  }, []);

  const sortingDataGridProps = useMemo(
    () =>
      ({
        disableColumnSorting: false,
        sortingMode: 'server',
        sortModel: sorting.column
          ? [{ field: sorting.column, sort: sorting.direction }]
          : [],
        onSortModelChange,
      }) as Pick<
        DataGridProps,
        | 'disableColumnSorting'
        | 'sortModel'
        | 'sortingMode'
        | 'onSortModelChange'
      >,
    [sorting, onSortModelChange],
  );

  return useMemo(
    () => ({
      sorting,
      sortingDataGridProps,
    }),
    [sortingDataGridProps, sorting],
  );
};
