import React, { useEffect, useState } from 'react';
import { useAuth } from '@base/auth-frontend-base';
import { useTypedRouter } from '@base/frontend-utils-base';
import useEffectOnce from '@base/ui-base/hooks/use-effect-once';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import z from 'zod';

const queryParams = z.object({
  oobCode: z.coerce.string(),
});

const VerifyEmailProcessUnwrapped = () => {
  const router = useTypedRouter(queryParams);
  const { verifyEmail, user } = useAuth();

  const [result, setResult] = useState<'error' | 'success'>();
  const { enqueueSnackbar } = useSnackbar();

  useEffectOnce(() => {
    verifyEmail(router.query.oobCode).then((result) => {
      setResult(result);
    });
  });

  useEffect(() => {
    if (result === 'success' && (!user || user.emailVerified)) {
      void router.replace('/').then(() => {
        enqueueSnackbar('Email has been successfully verified.', {
          variant: 'info',
        });
      });
    }
  }, [result, user?.emailVerified]);

  if (result === 'error') {
    return (
      <Box textAlign="center">
        <p>Email could not be verified or was verified in the past.</p>

        <Button onClick={() => router.replace('/')} variant="contained">
          To Home Page
        </Button>
      </Box>
    );
  }

  return null;
};

export const VerifyEmailProcess = React.memo(VerifyEmailProcessUnwrapped);
