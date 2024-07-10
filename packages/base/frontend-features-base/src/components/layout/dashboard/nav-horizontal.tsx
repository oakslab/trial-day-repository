import { memo } from 'react';
import { useAuth } from '@base/auth-frontend-base';
import {
  NavItemBaseProps,
  NavSectionHorizontal,
} from '@base/ui-base/components/nav-section';
import Scrollbar from '@base/ui-base/components/scrollbar';
import AppBar from '@mui/material/AppBar';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { bgBlur } from 'theme/module';
import { header } from '../common/constants';
import HeaderShadow from '../common/header-shadow';

// ----------------------------------------------------------------------
type Props = {
  navData: { subheader: string; items: NavItemBaseProps[] }[];
};

function NavHorizontal({ navData }: Props) {
  const theme = useTheme();

  const { userProfile } = useAuth();

  return (
    <AppBar
      component="div"
      sx={{
        top: header.desktopOffset,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <Scrollbar
          sx={{
            '& .simplebar-content': {
              display: 'flex',
            },
          }}
        >
          <NavSectionHorizontal
            data={navData}
            slotProps={{
              currentRole: userProfile?.role,
            }}
            sx={{
              ...theme.mixins.toolbar,
            }}
          />
        </Scrollbar>
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);
