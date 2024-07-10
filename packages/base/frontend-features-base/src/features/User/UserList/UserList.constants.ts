import { UserListInputType } from '@base/common-base';
import {
  userRoles,
  userStatuses,
} from '@base/common-base/src/domain/user/user.types';
import { trpc } from '@base/frontend-utils-base';
import {
  DateRange,
  getHumanReadableRange,
} from '@base/ui-base/components/custom-date-range-picker';
import { DatagridFilterConfig } from '@base/ui-base/components/datagrid';
import { ALL_OPTION } from '@base/ui-base/components/tabs-select';
import { UserStatus } from 'database';

export const defaultPageSize = 10;
export const pageSizeOptions = [defaultPageSize, 20, 50];

const statusColorMap = {
  [UserStatus.ACTIVE]: 'success',
  [UserStatus.PENDING]: 'warning',
  [UserStatus.BANNED]: 'error',
  [UserStatus.REJECTED]: 'error',
  [ALL_OPTION]: 'default',
} as const;

export const defaultFilters: UserListInputType['filters'] = {
  searchTerm: '',
  role: [],
  status: undefined,
  createdBetween: {
    start: null,
    end: null,
  },
};

export const filtersConfig: DatagridFilterConfig<UserListInputType['filters']> =
  {
    searchTerm: {
      type: 'text',
      label: 'Search',
      order: 2,
      width: '75%',
      debounce: true,
    },
    role: {
      type: 'select',
      options: [...userRoles],
      label: 'Role',
      order: 1,
      width: '25%',
    },
    createdBetween: {
      type: 'dateRange',
      label: 'Created At',
      order: 3,
      width: '75%',
      getValueLabel: (value) => {
        return getHumanReadableRange(value as DateRange);
      },
    },
    status: {
      type: 'tab',
      label: 'Status',
      width: '100%',
      allowAll: true,
      tabs: userStatuses.map((status) => ({
        label: status,
        value: status,
        color: statusColorMap[status],
      })),
      useCounts: () => {
        const { data } = trpc.user.listCountByStatus.useQuery(undefined, {
          keepPreviousData: true,
        });

        return data ?? {};
      },
    },
  };
