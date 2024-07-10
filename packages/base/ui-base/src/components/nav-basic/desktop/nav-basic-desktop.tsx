import { memo } from 'react';

import Stack from '@mui/material/Stack';

import { NavProps } from '../types';
import NavList from './nav-list';

// ----------------------------------------------------------------------

function NavBasicDesktop({ data, slotProps, ...other }: NavProps) {
  return (
    <Stack
      component="nav"
      id="nav-basic-desktop"
      spacing={5}
      direction="row"
      {...other}
    >
      {data.map((list) => (
        <NavList key={list.title} data={list} depth={1} slotProps={slotProps} />
      ))}
    </Stack>
  );
}

export default memo(NavBasicDesktop);
