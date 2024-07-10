import { Layout } from '@base/frontend-features-base/components/layout';
import NotFoundView from '@base/ui-base/components/not-found-view';
import Head from 'next/head';

export default function Custom404() {
  return (
    <Layout showNeedHelpMenu>
      <Head>
        <title>404 Page Not Found!</title>
      </Head>

      <NotFoundView />
    </Layout>
  );
}
