import React from 'react';
import { SplashScreen } from '@base/ui-base/components/loading-screen';
import { Box, Card, Button, Stack, Typography } from '@base/ui-base/ui';
import Link from 'next/link';
import { BackgroundGradient } from '../../../components/background-gradient';

import { useValidateInvitationKey } from './useValidateInvitationKey';

type Props = {
  logo: React.ReactNode;
  projectName: string;
  copyrightCaption?: string;
};
export const AcceptInviteLanding = ({
  logo,
  projectName,
  copyrightCaption,
}: Props) => {
  const { isValid, invitationKey } = useValidateInvitationKey();

  if (!isValid) {
    return <SplashScreen />;
  }

  return (
    <BackgroundGradient
      direction="column"
      alignItems="center"
      minHeight="100vh"
      py={10}
      spacing={4}
    >
      {logo}
      <Card
        sx={{
          p: 7,
          maxWidth: { xs: '100%', sm: 500 },
        }}
      >
        <Stack direction="column" alignItems="center" spacing={10}>
          <Box
            component="img"
            alt="Accept invite illustration"
            src="/images/accept-invite/illustration.png"
          />
          <Stack spacing={4} alignItems="center">
            <Stack spacing={2}>
              <Typography variant="h2" align="center">
                Welcome to {projectName}!
              </Typography>
              <Typography
                variant="body1"
                sx={{ px: 3, py: 2, color: 'text.secondary' }}
                align="center"
              >
                Your profile is set up and ready for the finishing touches.
                Let's complete it together. Click below to finalize your setup
                and get started.
              </Typography>
            </Stack>
            <Link
              passHref
              shallow
              href={`/invitation/${invitationKey}/setup-password`}
            >
              <Button variant="contained" sx={{ width: 'fit-content' }}>
                Get Started
              </Button>
            </Link>
          </Stack>
          {copyrightCaption && (
            <Typography variant="caption" align="center">
              {copyrightCaption}
            </Typography>
          )}
        </Stack>
      </Card>
    </BackgroundGradient>
  );
};
