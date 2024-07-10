import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import { varBounce, MotionContainer } from '../animate';
import Iconify from '../iconify';
import RouterLink from '../router-link';

// ----------------------------------------------------------------------

export default function InvitationKeyExpiredView() {
  const theme = useTheme();
  return (
    <MotionContainer>
      <Stack
        direction="column"
        alignItems="center"
        sx={{
          width: 400,
        }}
      >
        <m.div variants={varBounce().in}>
          <Iconify
            color={theme.palette.error.main}
            icon="solar:close-circle-linear"
            width={80}
            height={80}
          />
        </m.div>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" textAlign="center" sx={{ mb: 2, mt: 2 }}>
            Sorry, your invitation key has expired!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography variant="body1" textAlign="center" sx={{ mb: 10 }}>
            Please contact your administrator to receive a new invitation.
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
            color="primary"
          >
            Go to Home
          </Button>
        </m.div>
      </Stack>
    </MotionContainer>
  );
}
