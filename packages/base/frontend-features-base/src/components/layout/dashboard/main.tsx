import { ErrorSkeleton } from '@base/ui-base/components/error-skeleton';
import { useSettingsContext } from '@base/ui-base/components/settings';
import { useResponsive } from '@base/ui-base/hooks';
import Box, { BoxProps } from '@mui/material/Box';
import { withErrorBoundary } from 'react-error-boundary';
import { header, nav } from '../common/constants';

// ----------------------------------------------------------------------

const spacing = 8;

function Main({ children, sx, ...other }: BoxProps) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const isNavMini = settings.themeLayout === 'mini';

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexGrow: 1,
        minHeight: 1,
        flexDirection: 'column',
        py: `${header.mobile + spacing}px`,
        ...(lgUp && {
          px: 2,
          py: `${header.desktop + spacing}px`,
          width: `calc(100% - ${nav.vertical}px)`,
          ...(isNavMini && {
            width: `calc(100% - ${nav.wMini}px)`,
          }),
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

export default withErrorBoundary(Main, { FallbackComponent: ErrorSkeleton });
