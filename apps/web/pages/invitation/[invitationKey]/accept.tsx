import { AcceptInviteLanding } from '@base/frontend-features-base/features/Auth/AcceptInvite';
import { frontendEnv } from '@base/frontend-utils-base';
import Logo from '@base/ui-base/components/logo';
import { Stack, Typography } from '@base/ui-base/ui';
import Head from 'next/head';

const PROJECT_NAME = frontendEnv.NEXT_PUBLIC_APPLICATION_NAME;

export default function AcceptInvitePage() {
  return (
    <>
      <Head>
        <title>Accept Invitation</title>
      </Head>
      <AcceptInviteLanding
        logo={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Logo /> <Typography variant="h3">{PROJECT_NAME}</Typography>
          </Stack>
        }
        projectName={PROJECT_NAME || ''}
      />
    </>
  );
}
