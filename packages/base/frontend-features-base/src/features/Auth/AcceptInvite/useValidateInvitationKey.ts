import { useEffect, useState } from 'react';
import { authRoutes } from '@base/auth-frontend-base';
import { ExpectedErrorCode } from '@base/common-base';
import { trpc } from '@base/frontend-utils-base';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

export const useValidateInvitationKey = () => {
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  const invitationKey = router.query.invitationKey as string;
  const { data } = trpc.user.validateInvitationKey.useQuery(
    {
      invitationKey,
    },
    {
      enabled: !!invitationKey,
    },
  );

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (data?.result === 'error') {
      const error = data.error;
      if (
        error.code === ExpectedErrorCode.NOT_FOUND_ERROR ||
        (error.code === ExpectedErrorCode.INVALID_STATE_ERROR &&
          error.subcode !== 'invitation-key-already-accepted')
      ) {
        router.replace('/invitation/expired', {
          query: {
            reason:
              error.code === ExpectedErrorCode.NOT_FOUND_ERROR
                ? 'not-found'
                : error.subcode,
          },
        });
        return;
      }

      enqueueSnackbar('Invitation was already accepted', {
        variant: 'info',
      });
      router.replace(authRoutes.login);
      return;
    }
    if (data?.result === 'success') {
      setIsValid(true);
    }
  });

  return { isValid, invitationKey };
};
