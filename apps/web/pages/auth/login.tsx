import { Layout } from '@base/frontend-features-base/components/layout';
import { Login } from '@base/frontend-features-base/features/Auth/Login';
import { UserRole } from 'database';
import Head from 'next/head';

const expectedUserRoles = [UserRole.USER];

export default function LoginPage() {
  return (
    <Layout title="Hi, Welcome back" doubleColumnLayout>
      <Head>
        <title>Login</title>
      </Head>
      <Login expectedUserRoles={expectedUserRoles} />
    </Layout>
  );
}
