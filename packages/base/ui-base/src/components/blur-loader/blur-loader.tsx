import React from 'react';
import {
  BlurLoaderOverlay,
  BlurLoaderWrapper,
  BlurLoaderSpinner,
} from './styles';

type Props = {
  isLoading?: boolean;
};

export const BlurLoader = ({
  isLoading,
  children,
}: React.PropsWithChildren<Props>) => {
  return (
    <BlurLoaderWrapper className="wrapper">
      {children}

      <BlurLoaderOverlay isVisible={isLoading}>
        <BlurLoaderSpinner />
      </BlurLoaderOverlay>
    </BlurLoaderWrapper>
  );
};
