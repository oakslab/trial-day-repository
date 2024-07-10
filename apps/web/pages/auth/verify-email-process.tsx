import { Layout } from '@base/frontend-features-base/components/layout';
import { VerifyEmailProcess } from '@base/frontend-features-base/features/Auth/VerifyEmail';
import Head from 'next/head';

export default function VerifyEmailProcessPage() {
  return (
    <Layout showNeedHelpMenu>
      <Head>
        <title>Verification in progress...</title>
      </Head>
      <VerifyEmailProcess />
    </Layout>
  );
}
