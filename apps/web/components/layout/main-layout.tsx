// use Application Layout and pass the children only renamed function

import { ApplicationLayout } from '@base/frontend-features-base/components/layout';
import { useNavData } from './config-navigation';

type Props = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: Props) => {
  const navData = useNavData();
  return (
    <ApplicationLayout navData={navData}>
      <div>{children}</div>
    </ApplicationLayout>
  );
};
