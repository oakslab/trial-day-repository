import Stack from '@mui/material/Stack';

import { NavProps } from '../types';
import NavList from './nav-list';

// ----------------------------------------------------------------------

export default function MegaMenuDesktopVertical({
  data,
  sx,
  slotProps,
  ...other
}: NavProps) {
  return (
    <Stack
      component="nav"
      id="mega-menu-desktop-vertical"
      sx={{
        position: 'relative',
        ...sx,
      }}
      {...other}
    >
      {data.map((list) => (
        <NavList key={list.title} data={list} slotProps={slotProps} />
      ))}
    </Stack>
  );
}
