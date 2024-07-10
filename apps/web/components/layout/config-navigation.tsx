import { useMemo } from 'react';
import { Home } from '@base/ui-base/icons';
import { useTranslate } from '@base/ui-base/locales/index';
import { allRoutes } from '../../utils/routes';

/**
 * Custom hook that provides navigation data for the dashboard layout.
 * @returns An array of navigation data objects.
 */
export function useNavData() {
  const { t } = useTranslate();

  return useMemo(
    () => [
      {
        subheader: t('overview'),
        items: [
          {
            title: t('home'),
            path: allRoutes.home,
            icon: <Home />,
          },
        ],
      },
    ],
    [t],
  );
}
