import { Layout } from '@base/frontend-features-base/components/layout';
import { ResetPasswordRequest } from '@base/frontend-features-base/features/Auth/ResetPassword';
import Head from 'next/head';

export default function ForgotPasswordPage() {
  return (
    <Layout showNeedHelpMenu>
      <Head>
        <title>Forgot your password?</title>
      </Head>
      <ResetPasswordRequest />
    </Layout>
  );
}
