import { SortDirectionEnum } from '@base/common-base';
import { FilterValues } from '@base/ui-base/components/datagrid';

export type BaseEntity = {
  [key: string]: unknown;
};

export type TRPCQueryResult<TData> = {
  data: TData | undefined;
  isFetching: boolean;
  error: unknown | undefined;
  refetch: () => unknown;
};

export type ListQueryData<TEntity> = {
  readonly result: 'success';
  readonly data: {
    count: number;
    items: TEntity[];
  };
};

export type ListQueryResult<TEntity extends BaseEntity> = TRPCQueryResult<
  ListQueryData<TEntity>
>;

export type ListQueryInputOrderBy<TEntity> = {
  [key in keyof TEntity]?: (typeof SortDirectionEnum)[keyof typeof SortDirectionEnum];
};

export type ListQueryInput<
  TEntity extends BaseEntity,
  TFilters extends FilterValues,
> = {
  filters?: TFilters;
  orderBy?: ListQueryInputOrderBy<TEntity>;
  page?: number | undefined;
  pageSize?: number | undefined;
};

export type ListQuery<
  TEntity extends BaseEntity,
  TFilters extends FilterValues,
  TReturnType extends ListQueryResult<TEntity> = ListQueryResult<TEntity>,
> = (
  input: ListQueryInput<TEntity, TFilters>,
  options?: { keepPreviousData: boolean },
) => TReturnType;

export type CountsQuery<TKeys extends string> = (
  input: undefined,
  options?: { keepPreviousData: boolean },
) => TRPCQueryResult<{ [key in TKeys]: number }>;
