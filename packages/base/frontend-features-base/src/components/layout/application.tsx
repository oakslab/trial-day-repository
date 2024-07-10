import React, { useCallback } from 'react';

import { NavItemBaseProps } from '@base/ui-base/components/nav-section';
import { useSettingsContext } from '@base/ui-base/components/settings';
import { useBoolean } from '@base/ui-base/hooks';
import Box from '@mui/material/Box';
import Header from './dashboard/header';
import Main from './dashboard/main';
import { Navigation } from './Navigation';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  navData: { subheader: string; items: NavItemBaseProps[] }[];
  headerContent?: React.ReactElement;
};

export function ApplicationLayout({ children, navData, headerContent }: Props) {
  const settings = useSettingsContext();
  const nav = useBoolean();

  const navigation = <Navigation navData={navData} navBoolean={nav} />;

  const renderContent = useCallback(() => {
    if (settings.themeLayout === 'horizontal')
      return (
        <>
          {navigation}
          <Main>{children}</Main>
        </>
      );

    return (
      <Box
        sx={{
          width: '100%',
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {navigation}
        <Main>{children}</Main>
      </Box>
    );
  }, [children, nav.value]);

  return (
    <>
      <Header onOpenNav={nav.onTrue} headerContent={headerContent} />
      {renderContent()}
    </>
  );
}
