import * as Sentry from '@sentry/nextjs';
import { NextPageContext } from 'next';
import Error from 'next/error';

const CustomErrorComponent = (props: { statusCode: number }) => {
  return <Error statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (ctx: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(ctx);

  return Error.getInitialProps(ctx);
};

export default CustomErrorComponent;
