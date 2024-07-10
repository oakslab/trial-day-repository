import { FC, ReactNode } from 'react';
import { useResponsive } from '@base/ui-base/hooks/use-responsive';
import { Stack } from '@base/ui-base/ui';

export const DoubleColumnChildrenLayout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const mdUp = useResponsive('up', 'md');

  return (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: mdUp ? 480 : '100%',
        px: { xs: 2, md: 8 },
        pt: { xs: 15, md: 20 },
        pb: { xs: 15, md: 0 },
        backgroundColor: 'background.paper',
      }}
    >
      {children}
    </Stack>
  );
};
