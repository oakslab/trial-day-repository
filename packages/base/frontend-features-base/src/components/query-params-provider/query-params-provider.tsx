// Copied from: https://github.com/pbeshai/use-query-params/issues/13#issuecomment-815577849
import React, { memo } from 'react';
import { NextAdapter } from 'next-query-params';
import { QueryParamProvider as ContextProvider } from 'use-query-params';

const QueryParamProviderInner = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return <ContextProvider adapter={NextAdapter}>{children}</ContextProvider>;
};

export const QueryParamProvider = memo(QueryParamProviderInner);
