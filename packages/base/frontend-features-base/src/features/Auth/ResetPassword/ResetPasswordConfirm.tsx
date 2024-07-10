import { useEffect } from 'react';
import { AuthErrorCode, authRoutes, useAuth } from '@base/auth-frontend-base';
import type { ConfirmResetPasswordFormInputType } from '@base/common-base';
import { confirmResetPasswordFormInput } from '@base/common-base';
import {
  saveCredentialsToBrowserSilentError,
  trackExceptionInSentry,
  useTypedRouter,
} from '@base/frontend-utils-base';
import FormProvider, {
  RHFPasswordField,
} from '@base/ui-base/components/hook-form';
import { Stack, Typography, Box } from '@base/ui-base/ui';
import { FirebaseError } from '@firebase/app';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { UserRole } from 'database';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import z from 'zod';

const queryParams = z.object({
  oobCode: z.coerce.string(),
  email: z.coerce.string(),
});

type Props = {
  expectedUserRoles: UserRole[];
};

export const ResetPasswordConfirm = ({ expectedUserRoles }: Props) => {
  const router = useTypedRouter(queryParams);

  const { confirmPassword, login } = useAuth();

  const methods = useForm<ConfirmResetPasswordFormInputType>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    resolver: zodResolver(confirmResetPasswordFormInput),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  useEffect(() => {
    setValue('oobCode', router.query.oobCode);
  }, [router.query.oobCode, router.query.email]);

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data: ConfirmResetPasswordFormInputType) => {
    try {
      await confirmPassword(router.query.oobCode, data.newPassword);

      await saveCredentialsToBrowserSilentError(
        router.query.email,
        data.newPassword,
      );

      await login(
        {
          email: decodeURIComponent(router.query.email || ''),
          password: data.newPassword,
        },
        expectedUserRoles,
      );
      await router.replace('/');
      enqueueSnackbar('Password has been updated succesfully!', {
        variant: 'success',
      });
    } catch (error) {
      const errorCode =
        error instanceof FirebaseError
          ? String(error.code).replace('auth/', '')
          : null;

      if (errorCode === AuthErrorCode.INVALID_OOB_CODE) {
        enqueueSnackbar('This link is invalid. Please request a new link.', {
          variant: 'error',
        });
      } else {
        trackExceptionInSentry(error);
        enqueueSnackbar('Something went wrong.', {
          variant: 'error',
        });
      }
    }
  };

  return (
    <Box maxWidth="340px">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1}>
          <Typography mb={2} variant="h4" textAlign={'center'}>
            Please enter a new password
          </Typography>

          <Stack spacing={2.5} marginBottom={1}>
            <RHFPasswordField name="newPassword" label="Password" />
            <RHFPasswordField name="reNewPassword" label="Repeat Password" />
          </Stack>

          <LoadingButton
            fullWidth
            loading={isSubmitting}
            color="primary"
            size="large"
            type="submit"
            variant="contained"
          >
            Continue
          </LoadingButton>

          <Stack
            justifyContent="space-between"
            alignItems={'center'}
            spacing={1}
            marginTop={1}
          >
            <Typography
              color="primary"
              variant="body2"
              component={Link}
              href={authRoutes.login}
            >
              Back to Login
            </Typography>
          </Stack>
        </Stack>
      </FormProvider>
    </Box>
  );
};
