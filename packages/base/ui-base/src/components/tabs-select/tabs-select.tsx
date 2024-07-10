import { Tab, Tabs, alpha } from '@mui/material';
import { sum } from 'lodash';
import Label, { LabelColor } from '@base/ui-base/components/label';

export const ALL_OPTION = 'ALL' as const;

export type TabValue = string | number | typeof ALL_OPTION;

export type TabType<TValue extends TabValue = string> = {
  label: string;
  value: TValue;
  color?: LabelColor | LabelRenderFunction<TValue>;
};

export type LabelRenderFunction<TValue extends TabValue = string> = (
  dataCount: number,
  tab: TabType<TValue>,
) => JSX.Element;

export type TTabsFilter<
  TFilterKey extends string,
  TTabItem extends TabValue,
  TTabs extends TabType<TTabItem>[],
> = {
  filterKey: TFilterKey;
  tabs: TTabs;
  dataCounts?: Record<TTabItem, number | undefined>;
  value: TTabItem;
  onChange: (name: TFilterKey, value: TabValue | undefined) => void;
  allowAll?: boolean;
  colorMap?: Partial<Record<TTabItem | typeof ALL_OPTION, LabelColor>>;
};

export const TabsFilter = <
  TFilterKey extends string,
  TTabItem extends TabValue,
  TTabs extends TabType<TTabItem>[],
>({
  filterKey,
  value,
  tabs,
  dataCounts,
  onChange,
  allowAll = true,
}: TTabsFilter<TFilterKey, TTabItem, TTabs>) => {
  const calculateTabItemsAmount = (
    dataCounts: Record<TTabItem, number | undefined>,
    tabItem: TTabItem | typeof ALL_OPTION,
  ) => {
    if (tabItem === ALL_OPTION) {
      return sum(Object.values(dataCounts));
    } else {
      return dataCounts[tabItem] ?? 0;
    }
  };

  const tabsWithAll = allowAll
    ? [
        ...(tabs.some((tab) => tab.value === ALL_OPTION)
          ? []
          : [
              {
                label: ALL_OPTION,
                value: ALL_OPTION,
                color: 'default',
              },
            ]),
        ...tabs,
      ]
    : tabs;

  const renderedTabs = tabsWithAll.map((tab) => {
    const color: LabelColor | LabelRenderFunction =
      'color' in tab && tab.color
        ? (tab.color as LabelColor | LabelRenderFunction)
        : 'default';

    const renderLabel = () => {
      if (dataCounts) {
        return typeof color === 'function' ? (
          color(calculateTabItemsAmount(dataCounts, tab.value), tab as TabType)
        ) : (
          <Label variant="soft" color={color}>
            {calculateTabItemsAmount(dataCounts, tab.value)}
          </Label>
        );
      }
    };
    return (
      <Tab
        key={tab.value}
        iconPosition="end"
        value={tab.value}
        label={tab.label}
        icon={renderLabel()}
      />
    );
  });

  return (
    <Tabs
      value={!value ? (allowAll ? ALL_OPTION : tabs[0]?.value) : value}
      onChange={(_, val: string) =>
        onChange(filterKey, val !== ALL_OPTION ? val : undefined)
      }
      /* make it stretch fully */

      sx={{
        height: 48,
        px: 2.5,
        boxShadow: (theme) =>
          `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
      }}
    >
      {renderedTabs}
    </Tabs>
  );
};
