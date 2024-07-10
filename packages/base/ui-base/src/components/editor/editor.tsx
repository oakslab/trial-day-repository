import '../../utils/highlight';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { alpha, styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';

import Toolbar, { formats } from './toolbar';
import { EditorProps } from './types';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <Skeleton
      sx={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: 1,
        borderRadius: 1,
        position: 'absolute',
      }}
    />
  ),
});

// ----------------------------------------------------------------------

export default function Editor({
  id = 'minimal-quill',
  error,
  simple = false,
  helperText,
  sx,
  ...other
}: EditorProps) {
  const modules = {
    toolbar: {
      container: `#${id}`,
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <>
      <StyledEditor
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
            '& .ql-editor': {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            },
          }),
          ...sx,
        }}
      >
        <Toolbar id={id} simple={simple} />

        <ReactQuill
          modules={modules}
          formats={formats}
          placeholder="Write something awesome..."
          {...other}
        />
      </StyledEditor>

      {!!helperText && helperText}
    </>
  );
}

const StyledEditor = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
  '& .ql-container.ql-snow': {
    border: 'none',
    ...theme.typography.body2,
    fontFamily: theme.typography.fontFamily,
  },
  '& .ql-editor': {
    minHeight: 160,
    maxHeight: 640,
    backgroundColor: alpha(theme.palette.grey[500], 0.08),
    '&.ql-blank:before': {
      fontStyle: 'normal',
      color: theme.palette.text.disabled,
    },
    '& pre.ql-syntax': {
      ...theme.typography.body2,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[900],
    },
    '& h1': {
      ...theme.typography.h1,
    },
    '& h2': {
      ...theme.typography.h2,
    },
    '& h3': {
      ...theme.typography.h3,
    },
    '& h4': {
      ...theme.typography.h4,
    },
    '& h5': {
      ...theme.typography.h5,
    },
    '& h6': {
      ...theme.typography.h6,
    },
    '& p, li': {
      ...theme.typography.body2,
    },
  },
}));
