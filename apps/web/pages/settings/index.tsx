import { UserSettings } from '@base/frontend-features-base/features/User/UserSettings';
import Head from 'next/head';
import { MainLayout } from '../../components/layout/main-layout';

export default function SettingsPage() {
  return (
    <MainLayout>
      <Head>
        <title>Settings</title>
      </Head>
      <UserSettings />
    </MainLayout>
  );
}
