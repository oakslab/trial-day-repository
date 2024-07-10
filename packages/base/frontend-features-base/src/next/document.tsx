import {
  DocumentHeadTags,
  documentGetInitialProps,
  DocumentHeadTagsProps,
} from '@mui/material-nextjs/v14-pagesRouter';
import { DocumentProps, Head, Html, Main, NextScript } from 'next/document';

export default function NextDocument(
  props: DocumentProps & DocumentHeadTagsProps,
) {
  return (
    <Html lang="en">
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

NextDocument.getInitialProps = documentGetInitialProps;
