import { Layout } from '@base/frontend-features-base/components/layout';
import { Signup } from '@base/frontend-features-base/features/Auth/Signup';
import Head from 'next/head';

export default function SignupPage() {
  return (
    <Layout doubleColumnLayout>
      <Head>
        <title>Signup</title>
      </Head>
      <Signup />
    </Layout>
  );
}
