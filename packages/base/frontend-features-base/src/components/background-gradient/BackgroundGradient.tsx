import { Stack, StackProps, useTheme, alpha } from '@base/ui-base/ui';
import { bgGradient } from 'theme/module';

type Props = StackProps;

export const BackgroundGradient = (props: Props) => {
  const theme = useTheme();
  return (
    <Stack
      {...props}
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94,
          ),
          imgUrl: '/images/auth/background.jpg',
        }),
        ...props.sx,
      }}
    />
  );
};
