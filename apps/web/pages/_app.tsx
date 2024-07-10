import { NextApp } from '@base/frontend-features-base/next';
import { trpc } from '@base/frontend-utils-base';
import { PathMetadata } from '@base/ui-base/components/jira';
import { AppProps } from 'next/app';

const pathMetadataList: PathMetadata[] = [
  {
    pathRegex: /.*settings.*/,
    metadata: {
      screenId: 'BP-119',
      screenName: 'User Settings',
    },
  },
];

function App(props: AppProps) {
  return (
    <NextApp
      props={props}
      pageFaviconUrl="/images/favicon.ico"
      pageFaviconDarkUrl="/images/favicon-dark.ico"
      pathMetadataList={pathMetadataList}
    />
  );
}

export default trpc.withTRPC(App);
