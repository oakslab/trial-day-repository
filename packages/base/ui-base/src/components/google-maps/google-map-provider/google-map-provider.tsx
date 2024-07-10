import { ReactNode } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

export const GoogleMapProvider = ({
  children,
  apiKey,
}: {
  children: ReactNode;
  apiKey: string;
}) => {
  return <APIProvider apiKey={apiKey}>{children}</APIProvider>;
};
