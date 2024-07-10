import { useEffect } from 'react';
import { useAuth } from '@base/auth-frontend-base';
import Logo from '@base/ui-base/components/logo';
import {
  NavItemBaseProps,
  NavSectionVertical,
} from '@base/ui-base/components/nav-section';
import Scrollbar from '@base/ui-base/components/scrollbar';
import { useResponsive } from '@base/ui-base/hooks';
import { useTheme } from '@base/ui-base/ui';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { usePathname } from 'next/navigation';
import { nav } from '../common/constants';
import NavToggleButton from '../common/nav-toggle-button';

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
  navData: { subheader: string; items: NavItemBaseProps[] }[];
};

export default function NavVertical({ openNav, onCloseNav, navData }: Props) {
  const { userProfile } = useAuth();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const theme = useTheme();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4, mb: 1 }} />

      <NavSectionVertical
        data={navData}
        slotProps={{
          currentRole: userProfile?.role,
        }}
      />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: nav.vertical },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: nav.vertical,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
            background: theme.palette.background.default,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: nav.vertical,
              color: theme.palette.background.default,
              background: theme.palette.background.default,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
