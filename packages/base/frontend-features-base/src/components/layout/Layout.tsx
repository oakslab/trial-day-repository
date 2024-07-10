import { Stack } from '@base/ui-base/ui';
import { ApplicationLogo } from './ApplicationLogo';
import { DoubleColumn } from './double-column';
import { NeedHelpMenu } from './NeedHelpMenu';

export interface LayoutProps {
  title?: string;
  children: React.ReactNode;
  showNeedHelpMenu?: boolean;
  doubleColumnLayout?: boolean;
}

export function Layout({
  title,
  children,
  showNeedHelpMenu,
  doubleColumnLayout,
}: LayoutProps) {
  const pageTitle = title ?? 'Manage the job more efeciently with Minimal';

  const menu = showNeedHelpMenu ? <NeedHelpMenu /> : null;

  const content = doubleColumnLayout ? (
    <DoubleColumn title={pageTitle}>{children}</DoubleColumn>
  ) : (
    <>{children}</>
  );

  const wrappedContent = doubleColumnLayout ? (
    content
  ) : (
    <Stack
      sx={{
        minHeight: '100vh',
      }}
      minWidth="100%"
      justifyContent={'center'}
      alignItems={'center'}
    >
      {content}
    </Stack>
  );

  return (
    <Stack
      component="div"
      direction="row"
      minWidth="100%"
      sx={{
        minHeight: '100vh',
      }}
    >
      <ApplicationLogo />
      {menu}
      {wrappedContent}
    </Stack>
  );
}
