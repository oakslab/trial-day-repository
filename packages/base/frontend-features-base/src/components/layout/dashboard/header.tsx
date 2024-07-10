import { ReactElement } from 'react';
import { MenuItemIcon } from '@base/ui-base/assets/icons';
import { ErrorSkeleton } from '@base/ui-base/components/error-skeleton';
import Logo from '@base/ui-base/components/logo';
import { useSettingsContext } from '@base/ui-base/components/settings';
import { useResponsive, useOffSetTop } from '@base/ui-base/hooks';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { withErrorBoundary } from 'react-error-boundary';
import { bgBlur } from 'theme/module';
import AccountPopover from '../common/account-popover';
import { header, nav } from '../common/constants';
// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
  headerContent?: ReactElement;
};

function Header({ onOpenNav, headerContent }: Props) {
  const theme = useTheme();
  const settings = useSettingsContext();
  const lgUp = useResponsive('up', 'lg');
  const offset = useOffSetTop(header.desktop);
  const isNavHorizontal = settings.themeLayout === 'horizontal';
  const isNavMini = settings.themeLayout === 'mini';
  const offsetTop = offset && !isNavHorizontal;

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <MenuItemIcon />
        </IconButton>
      )}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: header.mobile,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${nav.vertical + 1}px)`,
          height: header.desktop,
          ...(offsetTop && {
            height: header.desktopOffset,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: header.desktopOffset,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${nav.wMini + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {headerContent}
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

export default withErrorBoundary(Header, { FallbackComponent: ErrorSkeleton });
