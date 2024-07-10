import { useState } from 'react';
import { authRoutes, useAuth } from '@base/auth-frontend-base';
import {
  sendResetPasswordEmailMutationInput,
  SendResetPasswordEmailMutationInputType,
} from '@base/common-base';
import FormProvider, { RHFTextField } from '@base/ui-base/components/hook-form';
import Iconify from '@base/ui-base/components/iconify';
import RouterLink from '@base/ui-base/components/router-link';
import { useFormAlert } from '@base/ui-base/hooks';
import { Box, Container, Link, Stack, Typography } from '@base/ui-base/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { TRPCClientError } from '@trpc/client';
import { useForm } from 'react-hook-form';

export const ResetPasswordRequest = () => {
  const { resetPassword } = useAuth();
  const { setErrorMsg, ErrorComponent } = useFormAlert();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const methods = useForm<SendResetPasswordEmailMutationInputType>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    resolver: zodResolver(sendResetPasswordEmailMutationInput),
    defaultValues: {
      email: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(
    async (data: SendResetPasswordEmailMutationInputType) => {
      try {
        await resetPassword(data.email);
        setIsSubmitSuccessful(true);
      } catch (err) {
        setErrorMsg(
          err instanceof TRPCClientError ? err.message : 'Invalid credentials',
        );
      }
    },
  );

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="email"
        label="Email Address"
        placeholder="john@doe.com"
        disabled={isSubmitSuccessful}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Reset Password
      </LoadingButton>
      <Link
        component={RouterLink}
        href={authRoutes.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'flex',
          marginX: 'auto',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <Box
        component="img"
        alt="auth"
        height={96}
        src="/images/auth/lock.svg"
        sx={{ mx: 'auto' }}
      />
      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Forgot your password?</Typography>
        {isSubmitSuccessful ? (
          <Typography variant="body1">
            Please check your inbox. If an account with this email address
            exists, you will receive an email with a link to reset your
            password. If you haven't received anything, please contact us
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Please enter the email address associated with your account, and
            we'll email you a link to reset your password.
          </Typography>
        )}
      </Stack>
    </>
  );

  return (
    <Container component="main">
      <Stack
        sx={{
          py: 12,
          m: 'auto',
          maxWidth: 400,
          minHeight: '100vh',
          textAlign: 'center',
          justifyContent: 'center',
        }}
      >
        {renderHead}
        <ErrorComponent />

        <FormProvider methods={methods} onSubmit={onSubmit}>
          {renderForm}
        </FormProvider>
      </Stack>
    </Container>
  );
};
