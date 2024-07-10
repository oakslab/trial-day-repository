import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack, { StackProps } from '@mui/material/Stack';
import Iconify from '@base/ui-base/components/iconify';
import {
  DatagridFilterConfig,
  FilterConfigBase,
  FilterValue,
} from './datagrid.types';

type Props<
  TConfigBase extends FilterConfigBase,
  TConfig extends DatagridFilterConfig<TConfigBase>,
  TFilters extends {
    [K in keyof TConfig]: FilterValue;
  },
> = StackProps & {
  config: TConfig;
  filters: TFilters;
  onResetFilters: () => void;
  results?: number;
};

export const DatagridFiltersResult = <
  TConfigBase extends FilterConfigBase,
  TConfig extends DatagridFilterConfig<TConfigBase>,
  TFilters extends {
    [K in keyof TConfig]: FilterValue;
  },
>({
  filters,
  config,
  onResetFilters,
  results,
  ...other
}: Props<TConfigBase, TConfig, TFilters>) => {
  if (results === undefined) return null;

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack
        flexGrow={1}
        spacing={1}
        direction="row"
        flexWrap="wrap"
        alignItems="center"
      >
        {Object.entries(filters).map(([filterName, filterValue], index) => {
          const filterConfig = config[filterName];
          if (
            !filterValue ||
            filterValue === '' ||
            (Array.isArray(filterValue) && filterValue.length === 0)
          )
            return null;

          return (
            <Block key={index} label={`${filterConfig?.label}:`}>
              {(Array.isArray(filterValue) ? filterValue : [filterValue]).map(
                (value) => {
                  const valueLabel = (() => {
                    if (filterConfig?.getValueLabel) {
                      // @ts-expect-error for some reason the type is `never`.
                      const label = filterConfig.getValueLabel?.(value);
                      if (label) return label;
                    }

                    if (filterConfig?.type === 'autocomplete') {
                      // use __INTERNAL__ data if available
                      const data = filterConfig?.__INTERNAL__?.data;
                      const option = data?.find((o) => o.value === value);
                      if (option) return option.label;
                    }

                    return value.toString();
                  })();
                  return (
                    <Chip key={filterName} size="small" label={valueLabel} />
                  );
                },
              )}
            </Block>
          );
        })}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
};

type BlockProps = StackProps & {
  label: string;
};

const Block: React.FC<BlockProps> = ({ label, children, sx, ...other }) => (
  <Stack
    component={Paper}
    variant="outlined"
    spacing={1}
    direction="row"
    sx={{
      p: 1,
      borderRadius: 1,
      overflow: 'hidden',
      borderStyle: 'dashed',
      ...sx,
    }}
    {...other}
  >
    <Box component="span" sx={{ typography: 'subtitle2' }}>
      {label}
    </Box>

    <Stack spacing={1} direction="row" flexWrap="wrap">
      {children}
    </Stack>
  </Stack>
);

export default DatagridFiltersResult;
