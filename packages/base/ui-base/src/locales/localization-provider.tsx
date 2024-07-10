'use client';

import { useMemo } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useLocales } from './use-locales';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function LocalizationProvider({ children }: Props) {
  const { currentLang } = useLocales();

  const adapterLocale = useMemo(() => currentLang.adapterLocale, [currentLang]);

  return (
    <MuiLocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={adapterLocale}
    >
      {children}
    </MuiLocalizationProvider>
  );
}
