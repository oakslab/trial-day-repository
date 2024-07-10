import {
  DependencyList,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DataGridProps,
  GridPaginationModel,
} from '@base/ui-base/components/datagrid';
import { NumberParam, useQueryParams, withDefault } from 'use-query-params';
export type Pagination = {
  page: number;
  limit: number;
};

export type PaginationOptions = {
  defaults?: {
    limit?: number;
  };
};

type UseBasePaginationProps = {
  setPagination: Dispatch<SetStateAction<Pagination>>;
  pagination: Pagination;
  resetDependencies: DependencyList;
};

const DEFAULT_LIMIT = 10;

const useBasePagination = ({
  pagination,
  setPagination,
  resetDependencies,
}: UseBasePaginationProps) => {
  const isFirstRenderRef = useRef(true);

  const { page, limit } = pagination;

  const token = useMemo(() => {
    return (page * limit).toString();
  }, [page, limit]);

  const setPaginationPartially = useCallback(
    (newPagination: Partial<Pagination>) => {
      setPagination((oldPagination) => ({
        ...oldPagination,
        ...newPagination,
      }));
    },
    [setPagination],
  );

  const onPageChange = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPaginationPartially({ page: newPage });
    },
    [setPaginationPartially],
  );

  const onRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPaginationPartially({
        page: 0,
        limit: parseInt(event.target.value, 10),
      });
    },
    [setPaginationPartially],
  );

  const onPaginationModelChange = useCallback(
    (newModel: GridPaginationModel) => {
      setPagination({
        page: newModel.page,
        limit: newModel.pageSize,
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setPagination((oldPagination) => ({
      limit: oldPagination.limit,
      page: 0,
    }));
  }, [setPagination]);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    reset();
  }, [...resetDependencies, reset]);

  return {
    page,
    limit,
    token,
    onPageChange,
    onRowsPerPageChange,
    onPaginationModelChange,
    reset,
    setPagination,
  };
};

export type PaginationHookResult = ReturnType<typeof useBasePagination>;

export const usePagination = (resetDependencies: DependencyList = []) => {
  const [pagination, setPagination] = useState<Pagination>({
    limit: 10,
    page: 0,
  });

  return useBasePagination({ pagination, setPagination, resetDependencies });
};

export const usePersistentPagination = (
  resetDependencies: DependencyList = [],
  options?: PaginationOptions,
) => {
  const [pagination, setPagination] = useQueryParams(
    {
      page: withDefault(NumberParam, 0),
      limit: withDefault(
        NumberParam,
        options?.defaults?.limit ?? DEFAULT_LIMIT,
      ),
    },
    { removeDefaultsFromUrl: true, enableBatching: true },
  );

  return useBasePagination({
    pagination,
    setPagination,
    resetDependencies,
  });
};

export type UsePaginationReturnType = ReturnType<
  typeof usePersistentPagination
>;

export const useDataGridPagination = (
  resetDependencies: DependencyList = [],
  options?: PaginationOptions,
) => {
  const { page, limit, onPaginationModelChange } = usePersistentPagination(
    resetDependencies,
    options,
  );

  return useMemo(
    () =>
      ({
        pagination: true,
        page: page,
        pageSize: limit,
        paginationMode: 'server',
        paginationModel: {
          page: page,
          pageSize: limit,
        },
        onPaginationModelChange,
      }) as Pick<
        DataGridProps,
        | 'pagination'
        | 'paginationMode'
        | 'paginationModel'
        | 'onPaginationModelChange'
      >,
    [page, limit, onPaginationModelChange],
  );
};
