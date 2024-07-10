import RouterLink from '@base/ui-base/components/router-link';
import { Box, Link, Stack } from '@base/ui-base/ui';

export const NeedHelpMenu = () => {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        zIndex: 9,
        position: 'absolute',
        right: 0,
        m: { xs: 4, md: 4 },
      }}
    >
      <Box component="img" alt="auth" src="/images/auth/settings.svg" />
      <Link
        href={'#'}
        component={RouterLink}
        color="inherit"
        sx={{ typography: 'subtitle2' }}
      >
        Need help?
      </Link>
    </Stack>
  );
};
