import InvitationKeyExpiredView from '@base/ui-base/components/invitation-key-expired-view';
import { Layout } from '@base/frontend-features-base/components/layout';
import Head from 'next/head';

export default function InvitationKeyExpiredPage() {
  return (
    <Layout showNeedHelpMenu>
      <Head>
        <title>Invitation key expired!</title>
      </Head>

      <InvitationKeyExpiredView />
    </Layout>
  );
}
