import Logo from '@base/ui-base/components/logo';

export function ApplicationLogo() {
  return (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: { xs: 3, md: 3 },
      }}
    />
  );
}
