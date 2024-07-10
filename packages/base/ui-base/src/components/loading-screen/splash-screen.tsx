import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { m } from 'framer-motion';

// ----------------------------------------------------------------------

function SplashScreenInternal({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={{
        right: 0,
        width: 1,
        bottom: 0,
        height: 1,
        zIndex: 9998,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        ...sx,
      }}
      {...other}
    >
      <Box
        component={m.div}
        animate={{
          scale: [1.6, 1, 1, 1.6, 1.6],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{
          ease: 'linear',
          duration: 3.2,
          repeat: Infinity,
        }}
        sx={{
          width: 60,
          height: 60,
          position: 'absolute',
          border: (theme) =>
            `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`,
        }}
      />

      <Box
        component={m.div}
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{
          ease: 'linear',
          duration: 3.2,
          repeat: Infinity,
        }}
        sx={{
          width: 80,
          height: 80,
          position: 'absolute',
          border: (theme) =>
            `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`,
        }}
      />

      <Box
        component={m.div}
        animate={{
          scale: [1, 1.4, 1.4, 1, 1],
          rotate: [0, 360, 360, 0, 0],
          opacity: [1, 0.5, 0.5, 0.5, 1],
          borderRadius: ['20%', '20%', '45%', '45%', '20%'],
        }}
        transition={{
          ease: 'easeInOut',
          duration: 4.2,
          repeat: Infinity,
        }}
        sx={{
          width: 100,
          height: 100,
          position: 'absolute',
          border: (theme) =>
            `solid 5px ${alpha(theme.palette.primary.light, 0.48)}`,
        }}
      />
    </Box>
  );
}

const SplashScreen = React.memo(SplashScreenInternal);

export default SplashScreen;
