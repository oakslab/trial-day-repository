import { Layout } from '@base/frontend-features-base/components/layout';
import { AcceptInviteSetupPassword } from '@base/frontend-features-base/features/Auth/AcceptInvite';
import Head from 'next/head';

export default function SetupPasswordPage() {
  return (
    <Layout doubleColumnLayout>
      <Head>
        <title>Accept Invitation | Setup Password</title>
      </Head>
      <AcceptInviteSetupPassword />
    </Layout>
  );
}
