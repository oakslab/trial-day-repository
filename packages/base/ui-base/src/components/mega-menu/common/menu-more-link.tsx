import Link from '@mui/material/Link';

import Iconify from '../../iconify';

import RouterLink from '../../router-link';

import { NavLink } from '../types';

// ----------------------------------------------------------------------

export default function MenuMoreLink({ title, path }: NavLink) {
  return (
    <Link
      component={RouterLink}
      href={path}
      color="inherit"
      sx={{
        alignItems: 'center',
        typography: 'caption',
        display: 'inline-flex',
        alignSelf: 'flex-end',
        fontWeight: 'fontWeightBold',
      }}
    >
      {title} <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
    </Link>
  );
}
