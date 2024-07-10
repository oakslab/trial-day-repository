import { ReactNode } from 'react';
import { DateRange } from '../custom-date-range-picker';
import { LabelColor } from '../label';
import { ALL_OPTION, LabelRenderFunction } from '../tabs-select';

export type DatagridFiltersRefHandle = {
  resetFilterValue: () => void;
};

export type MultiFilterValue = string[];
export type AutoCompleteOption = {
  label: string;
  value: string;
};

export type FilterValue =
  | string
  | MultiFilterValue
  | number
  | undefined
  | DateRange;

export type FilterValues = Record<string, FilterValue>;

export type DatagridFilterBase<T extends FilterValue = FilterValue> = {
  name: string;
  value: T;
  label: string;
};

type FieldFilter<T extends FilterValue | MultiFilterValue> = {
  label: string;
  placeholder?: string;
  defaultValue?: T;
  width?: string;
  order?: number;
  getValueLabel?: (value: Exclude<T, undefined>) => string;
};

export type TextFilterConfig<T extends FilterValue | MultiFilterValue> =
  T extends FilterValue
    ? FieldFilter<T> & {
        type: 'text';
        debounce?: boolean;
      }
    : never;

export type SelectFilterConfig<T extends FilterValue | MultiFilterValue> =
  T extends MultiFilterValue
    ? FieldFilter<T> & {
        type: 'select';
        options: T;
      }
    : never;

export type TabFilterConfig<T extends FilterValue> = {
  type: 'tab';
  allowAll?: boolean;
  tabs: {
    label: string;
    value: NonNullable<T | typeof ALL_OPTION>;
    color?:
      | LabelColor
      | LabelRenderFunction<
          T extends string ? NonNullable<T | typeof ALL_OPTION> : never
        >;
  }[];
  useCounts?: () => {
    [P in NonNullable<T> extends string ? NonNullable<T> : never]?:
      | number
      | undefined;
  };
} & FieldFilter<T | typeof ALL_OPTION>;

export type DateRangeFilterConfig<T extends FilterValue> = {
  type: 'dateRange';
  debounce?: boolean;
} & FieldFilter<T>;

export type AutocompleteFilterConfig<T extends FilterValue | MultiFilterValue> =
  T extends MultiFilterValue
    ? {
        type: 'autocomplete';
        useOptions: (search: string) => {
          isLoading: boolean;
          data: AutoCompleteOption[] | undefined;
        };
        __INTERNAL__?: {
          data: AutoCompleteOption[];
        };
      } & FieldFilter<T>
    : never;

export type CustomFilterConfig<T extends FilterValue | MultiFilterValue> = {
  type: 'custom';
  render: <TValue extends T = T>(
    value: TValue,
    onChange: (value: TValue) => void,
  ) => ReactNode;
  defaultValue: T;
} & Omit<FieldFilter<T>, 'defaultValue'>;

export type FilterConfigBase =
  | Record<string, FilterValue | MultiFilterValue>
  | undefined;

export type DatagridFilterConfig<T extends FilterConfigBase> = {
  [K in keyof NonNullable<T>]?:
    | TextFilterConfig<NonNullable<T>[K]>
    | SelectFilterConfig<NonNullable<T>[K]>
    | TabFilterConfig<NonNullable<T>[K]>
    | AutocompleteFilterConfig<NonNullable<T>[K]>
    | CustomFilterConfig<NonNullable<T>[K]>
    | DateRangeFilterConfig<NonNullable<T>[K]>;
};
