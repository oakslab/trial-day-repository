import { Box, CircularProgress, styled } from '@mui/material';

export const BlurLoaderWrapper = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
}));

export const BlurLoaderOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isVisible',
})<{ isVisible?: boolean }>(({ theme, isVisible }) => ({
  top: 0,
  left: 0,
  position: 'absolute',
  width: '100%',
  height: '100%',
  background: 'transparent',
  zIndex: theme.zIndex.modal,
  opacity: isVisible ? 1 : 0,
  transition: 'all 0.1s ease-out',
  // blur the background
  backdropFilter: 'blur(2px)',
  // pass pointer events to underlying elements
  pointerEvents: isVisible ? 'auto' : 'none',
}));

export const BlurLoaderSpinner = styled(CircularProgress)(({ theme }) => ({
  zIndex: theme.zIndex.modal + 1,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}));
