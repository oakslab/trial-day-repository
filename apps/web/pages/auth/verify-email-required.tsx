import { useEffect } from 'react';
import { useAuth } from '@base/auth-frontend-base';
import { Layout } from '@base/frontend-features-base/components/layout';
import { VerifyEmail } from '@base/frontend-features-base/features/Auth/VerifyEmail';
import Head from 'next/head';
import { useRouter } from 'next/router';

const POLLING_INTERVAL = 1000;

export default function VerifyEmailRequiredPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!user) {
        router.replace('/auth/login');
        return;
      }
      const refreshedUser = await refreshUser();

      if (refreshedUser?.emailVerified) {
        clearInterval(intervalId);
        router.replace('/');
      }
    }, POLLING_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Layout showNeedHelpMenu>
      <Head>
        <title>Email Verification Required</title>
      </Head>
      <VerifyEmail />
    </Layout>
  );
}
