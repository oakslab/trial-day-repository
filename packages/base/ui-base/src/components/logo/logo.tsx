import { forwardRef } from 'react';

import Box, { BoxProps } from '@mui/material/Box';
import Link from '@mui/material/Link';

import { RouterLink } from '../router-link/router-link';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    // OR using local (public folder)
    // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="/logo/logo_single.svg" => your path
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

    const LOGO_SIZE = 40;

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: LOGO_SIZE,
          height: LOGO_SIZE,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <svg
          width={LOGO_SIZE}
          height={LOGO_SIZE}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.1785 19.9799C14.1785 22.9027 11.809 25.2722 8.8861 25.2722C5.96322 25.2722 3.59375 22.9027 3.59375 19.9799C3.59375 17.057 5.96322 14.6875 8.8861 14.6875C11.809 14.6875 14.1785 17.057 14.1785 19.9799ZM25.2922 19.9799C25.2922 22.9027 22.9227 25.2722 19.9998 25.2722C17.0769 25.2722 14.7075 22.9027 14.7075 19.9799C14.7075 17.057 17.0769 14.6875 19.9998 14.6875C22.9227 14.6875 25.2922 17.057 25.2922 19.9799ZM25.8215 19.9799C25.8215 22.9027 28.191 25.2722 31.1139 25.2722C34.0368 25.2722 36.4062 22.9027 36.4062 19.9799C36.4062 17.057 34.0368 14.6875 31.1139 14.6875C28.191 14.6875 25.8215 17.057 25.8215 19.9799ZM34.7524 19.9798C34.7524 21.9893 33.1234 23.6183 31.1139 23.6183C29.1044 23.6183 27.4754 21.9893 27.4754 19.9798C27.4754 17.9704 29.1044 16.3414 31.1139 16.3414C33.1234 16.3414 34.7524 17.9704 34.7524 19.9798Z"
            fill="black"
          />
        </svg>
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  },
);

export default Logo;
