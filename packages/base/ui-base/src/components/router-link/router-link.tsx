import { forwardRef } from 'react';
import Link, { LinkProps } from 'next/link';

// ----------------------------------------------------------------------

export const RouterLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ ...other }, ref) => <Link ref={ref} {...other} />,
);
