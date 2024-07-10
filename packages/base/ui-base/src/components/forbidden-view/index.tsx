import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';

import ForbiddenIllustration from '../../assets/illustrations/forbidden-illustration';
import { varBounce, MotionContainer } from '../animate';
import RouterLink from '../router-link';

// ----------------------------------------------------------------------

export default function ForbiddenView() {
  return (
    <Stack spacing={3} sx={{ textAlign: 'center' }}>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Forbidden
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            The page you&apos;re trying access has restricted access.
            <br />
            Please refer to your system administrator
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button
          component={RouterLink}
          href="/"
          size="large"
          variant="contained"
        >
          Go to Home
        </Button>
      </MotionContainer>
    </Stack>
  );
}
