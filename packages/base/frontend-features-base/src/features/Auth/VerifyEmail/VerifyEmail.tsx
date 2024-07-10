import { useEffect, useState } from 'react';
import { authRoutes, useAuth } from '@base/auth-frontend-base';
import { Box, Button, Container, Stack, Typography } from '@base/ui-base/ui';
import { useRouter } from 'next/router';

const RESEND_TIMEOUT_SECONDS = 30;

export const VerifyEmail = () => {
  const router = useRouter();
  const { userProfile, logout, sendEmailVerification } = useAuth();

  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (secondsLeft > 0) {
        setSecondsLeft(secondsLeft - 1);
      }
      if (secondsLeft === 0) {
        clearInterval(intervalId);
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  });

  if (!userProfile?.email) return null;

  return (
    <Container component="main">
      <Stack
        sx={{
          m: 'auto',
          maxWidth: 480,
          justifyContent: 'center',
        }}
        spacing={6}
      >
        <Box
          component="img"
          alt="auth"
          src="/images/auth/mail.svg"
          sx={{
            mx: 'auto',
          }}
        />

        <Stack spacing={2} width="100%" textAlign="center">
          <Typography variant="h3">Please check your email!</Typography>

          <Typography variant="body1" textAlign="center">
            <Box component="span" color="gray">
              We have sent a confirmation link to
            </Box>
            <br />
            {userProfile?.email}
          </Typography>

          <Button
            disabled={!!secondsLeft}
            onClick={() => {
              sendEmailVerification(userProfile.email);
              setSecondsLeft(RESEND_TIMEOUT_SECONDS);
            }}
            variant="contained"
          >
            Resend {secondsLeft ? `(${secondsLeft}s)` : null}
          </Button>

          <Button
            onClick={async () => {
              await logout();
              router.replace(authRoutes.login);
            }}
          >
            Logout
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};
