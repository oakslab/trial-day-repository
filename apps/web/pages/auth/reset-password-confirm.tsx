import { Layout } from '@base/frontend-features-base/components/layout';
import { ResetPasswordConfirm } from '@base/frontend-features-base/features/Auth/ResetPassword';
import { UserRole } from 'database';
import Head from 'next/head';

export default function ForgotPasswordPage() {
  return (
    <Layout showNeedHelpMenu>
      <Head>
        <title>Reset your password</title>
      </Head>
      <ResetPasswordConfirm expectedUserRoles={[UserRole.USER]} />
    </Layout>
  );
}
