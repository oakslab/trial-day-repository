import Stack from '@mui/material/Stack';

import { NavProps } from '../types';
import NavList from './nav-list';

// ----------------------------------------------------------------------

export default function MegaMenuMobile({
  data,
  slotProps,
  ...other
}: NavProps) {
  return (
    <Stack component="nav" id="mega-menu-mobile" {...other}>
      {data.map((list) => (
        <NavList key={list.title} data={list} slotProps={slotProps} />
      ))}
    </Stack>
  );
}