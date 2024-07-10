import { FilterValues } from '@base/ui-base/components/datagrid';
import { PaginationHookResult } from '../use-pagination';
import { Sorting } from '../use-sorting';
import {
  BaseEntity,
  ListQuery,
  ListQueryInputOrderBy,
  ListQueryResult,
} from './types';

export type UseListOptions<TFilters extends FilterValues> = {
  filters?: TFilters;
  pagination?: Pick<PaginationHookResult, 'page' | 'limit'>;
  sorting?: Sorting;
};

export const useList = <
  TEntity extends BaseEntity,
  TFilters extends FilterValues,
  TReturnType extends ListQueryResult<TEntity> = ListQueryResult<TEntity>,
>(
  listQuery: ListQuery<TEntity, TFilters, TReturnType>,
  options?: UseListOptions<TFilters>,
) => {
  return listQuery(
    {
      filters: options?.filters,
      page: options?.pagination?.page,
      pageSize: options?.pagination?.limit,
      orderBy: options?.sorting?.column
        ? ({
            [options.sorting.column as keyof TEntity]:
              options.sorting.direction,
          } as ListQueryInputOrderBy<TEntity>)
        : undefined,
    },
    { keepPreviousData: true },
  );
};
