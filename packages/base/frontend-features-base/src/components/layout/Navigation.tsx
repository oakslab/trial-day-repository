import { ErrorSkeleton } from '@base/ui-base/components/error-skeleton';
import { NavItemBaseProps } from '@base/ui-base/components/nav-section';
import { useSettingsContext } from '@base/ui-base/components/settings';
import { useResponsive, useBoolean } from '@base/ui-base/hooks';
import { withErrorBoundary } from 'react-error-boundary';
import NavHorizontal from './dashboard/nav-horizontal';
import NavMini from './dashboard/nav-mini';
import NavVertical from './dashboard/nav-vertical';

type Props = {
  navData: { subheader: string; items: NavItemBaseProps[] }[];
  navBoolean: ReturnType<typeof useBoolean>;
};

export const Navigation = withErrorBoundary(
  ({ navData, navBoolean }: Props) => {
    const settings = useSettingsContext();
    const lgUp = useResponsive('up', 'lg');
    const nav = navBoolean;

    const isHorizontal = settings.themeLayout === 'horizontal';
    const isMini = settings.themeLayout === 'mini';

    const renderNavMini = <NavMini navData={navData} />;

    const renderHorizontal = <NavHorizontal navData={navData} />;

    const renderNavVertical = (
      <NavVertical
        navData={navData}
        openNav={nav.value}
        onCloseNav={nav.onFalse}
      />
    );

    if (isHorizontal) {
      return lgUp ? renderHorizontal : renderNavVertical;
    }

    if (isMini) {
      return lgUp ? renderNavMini : renderNavVertical;
    }

    return renderNavVertical;
  },
  {
    FallbackComponent: ErrorSkeleton,
  },
);
