import { FC } from 'react';
import { useResponsive } from '@base/ui-base/hooks';
import { useTheme, Typography, Box } from '@base/ui-base/ui';
import { BackgroundGradient } from '../../../background-gradient';

export const DoubleColumnIllustration: FC<{
  title: string;
}> = ({ title }) => {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  return (
    <>
      {mdUp && (
        <BackgroundGradient
          flexGrow={1}
          spacing={10}
          alignItems="center"
          sx={{
            pt: 12,
          }}
        >
          <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
            {title}
          </Typography>

          <Box
            component="img"
            alt="auth"
            src="/images/auth/illustration.png"
            sx={{
              maxWidth: {
                xs: 480,
                lg: 560,
                xl: 720,
              },
            }}
          />
        </BackgroundGradient>
      )}
    </>
  );
};
