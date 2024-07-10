import { useAuth } from '@base/auth-frontend-base';
import Logo from '@base/ui-base/components/logo';
import {
  NavItemBaseProps,
  NavSectionMini,
} from '@base/ui-base/components/nav-section';
import { useTheme } from '@base/ui-base/ui';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { hideScroll } from 'theme/module';
import { nav } from '../common/constants';
import NavToggleButton from '../common/nav-toggle-button';

type Props = {
  navData: { subheader: string; items: NavItemBaseProps[] }[];
};
export default function NavMini({ navData }: Props) {
  const { userProfile } = useAuth();
  const theme = useTheme();

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: nav.wMini },
        background: theme.palette.background.default,
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: nav.wMini - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: nav.wMini,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <Logo sx={{ mx: 'auto', my: 2 }} />

        <NavSectionMini
          data={navData}
          slotProps={{
            currentRole: userProfile?.role,
          }}
        />
      </Stack>
    </Box>
  );
}
