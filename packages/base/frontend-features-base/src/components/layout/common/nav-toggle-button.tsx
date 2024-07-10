import Iconify from '@base/ui-base/components/iconify';
import { useSettingsContext } from '@base/ui-base/components/settings';
import { useResponsive } from '@base/ui-base/hooks';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { bgBlur } from 'theme/module';
import { nav } from './constants';

export default function NavToggleButton({ sx, ...other }: IconButtonProps) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  if (!lgUp) {
    return null;
  }

  return (
    <IconButton
      size="small"
      onClick={() =>
        settings.onUpdate(
          'themeLayout',
          settings.themeLayout === 'vertical' ? 'mini' : 'vertical',
        )
      }
      sx={{
        p: 0.5,
        top: 32,
        position: 'fixed',
        left: nav.vertical - 12,
        zIndex: theme.zIndex.appBar + 1,
        border: `dashed 1px ${theme.palette.divider}`,
        ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
        '&:hover': {
          bgcolor: 'background.default',
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify
        width={16}
        icon={
          settings.themeLayout === 'vertical'
            ? 'eva:arrow-ios-back-fill'
            : 'eva:arrow-ios-forward-fill'
        }
      />
    </IconButton>
  );
}
