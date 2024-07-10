import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';

import { varBounce, MotionContainer } from '../animate';
import RouterLink from '../router-link';

// ----------------------------------------------------------------------

export default function NotFoundView() {
  return (
    <MotionContainer>
      <Stack
        direction="column"
        sx={{
          width: 400,
        }}
      >
        <m.div variants={varBounce().in}>
          <Typography variant="h3" textAlign="center" sx={{ mb: 2 }}>
            Sorry, page not found!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography variant="body1" textAlign="center" sx={{ mb: 10 }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
            mistyped the URL? Be sure to check your spelling.
          </Typography>
        </m.div>

        <m.div
          variants={varBounce().in}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Button
            component={RouterLink}
            href="/"
            size="large"
            variant="contained"
            sx={{
              bgcolor: '#EBFF00',
              color: 'common.black',
              '&:hover': {
                bgcolor: '#EBFF00',
              },
            }}
          >
            Go to Home
          </Button>
        </m.div>
      </Stack>
    </MotionContainer>
  );
}
