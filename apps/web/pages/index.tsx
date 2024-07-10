import {
  PermissionGuard,
  useAuth,
  usePermission,
} from '@base/auth-frontend-base';
import { trpc } from '@base/frontend-utils-base';
import { Alert, Stack, Typography } from '@base/ui-base/ui';
import Head from 'next/head';
import { MainLayout } from '../components/layout/main-layout';

function PageIndex() {
  const { userProfile, user } = useAuth();
  const hasPermissionForUser = usePermission(['user.*', 'auditLog.*']);

  const { data: healthData, isInitialLoading } = trpc.health.status.useQuery(
    undefined,
    {
      refetchInterval: 1000,
      enabled: false, // Enable for test if need
    },
  );

  return (
    <MainLayout>
      <Head>
        <title>Welcome...</title>
        <meta
          name="viewport"
          content="width=device-width, viewport-fit=cover, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Stack spacing={1} marginLeft={3}>
        <Typography variant="body1">
          The date fetched from server in intervals:
        </Typography>

        <Typography variant="body2">
          {isInitialLoading
            ? 'Loading...'
            : healthData?.date.toString() || 'Can not get date'}
        </Typography>

        <Typography variant="body1">
          User email coming from Firebase Auth service:
        </Typography>
        <Typography variant="body2">
          {userProfile ? userProfile.email : 'Not authenticated'}
        </Typography>

        <Typography variant="body1">Is email verified:</Typography>
        <Typography variant="body2">
          {user?.emailVerified ? 'Yes' : 'No / no info / page refresh required'}
        </Typography>
        <PermissionGuard permissions={['user.*']}>
          <Typography variant="body1">Admin has User.*</Typography>
        </PermissionGuard>
        <PermissionGuard permissions={['self.*']}>
          <Typography variant="body1">User has self.*</Typography>
        </PermissionGuard>
        <Typography variant="body1">
          This Role {userProfile?.role} has `['user.*','auditLog.*']`
          permissions {hasPermissionForUser ? 'true' : 'false'}
        </Typography>

        <Alert severity="info">
          This page is only for testing purposes. It will be removed in the
          production
        </Alert>
      </Stack>
    </MainLayout>
  );
}

export default PageIndex;
