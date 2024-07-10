import { useEffect } from 'react';
import { AuthErrorCode, useAuth } from '@base/auth-frontend-base';
import { SplashScreen } from '@base/ui-base/components/loading-screen';
import { FirebaseError } from '@firebase/app';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

export const ActAs = () => {
  const router = useRouter();
  const { loginUsingCustomToken } = useAuth();

  const token = router.query.token as string;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!router.isReady) return;
    if (!token) {
      router.push('/404');
      return;
    }

    (async () => {
      try {
        const user = await loginUsingCustomToken(token);
        if (!user) {
          enqueueSnackbar('Failed to login on behalf the user.', {
            variant: 'error',
          });
          return;
        }

        enqueueSnackbar(
          `Successfully logged in on behalf of ${user.firstName} ${user.lastName} (${user.email}).`,
          { variant: 'success' },
        );
        router.push('/');
      } catch (e) {
        if (
          e instanceof FirebaseError &&
          e.code.includes(AuthErrorCode.UNEXPECTED_TOKEN_ERROR_PREFIX)
        ) {
          return router.push('/404');
        }

        throw e;
      }
    })();
  }, [token, router]);

  return <SplashScreen />;
};
