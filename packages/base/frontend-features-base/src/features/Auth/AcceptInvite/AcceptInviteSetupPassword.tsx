import { authRoutes, useAuth } from '@base/auth-frontend-base';
import { ExpectedErrorCode } from '@base/common-base';
import {
  UserAcceptInviteFormInputType,
  userAcceptInviteFormInput,
} from '@base/common-base/src/domain';
import FormProvider, {
  RHFPasswordField,
  RHFTextField,
} from '@base/ui-base/components/hook-form';
import { SplashScreen } from '@base/ui-base/components/loading-screen';
import { useFormAlert } from '@base/ui-base/hooks';
import { Stack, Typography } from '@base/ui-base/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useUserAcceptInviteMutation } from './AcceptInvite.mutations';
import { useValidateInvitationKey } from './useValidateInvitationKey';

export const AcceptInviteSetupPassword = () => {
  const { login } = useAuth();
  const { setErrorMsg, ErrorComponent } = useFormAlert();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const { isValid, invitationKey } = useValidateInvitationKey();

  const { mutateAsync } = useUserAcceptInviteMutation({
    onSuccess: async (response) => {
      if (response.result === 'success') {
        await login(
          {
            email: response.data.email,
            password: methods.getValues('password'),
          },
          [response.data.role],
        );
        router.replace('/');

        enqueueSnackbar('Invitation accepted successfully', {
          variant: 'success',
        });
      } else if (
        response.error.code === ExpectedErrorCode.NOT_FOUND_ERROR ||
        response.error.subcode !== 'invitation-key-already-accepted'
      ) {
        setErrorMsg(response.error.message);
      } else {
        enqueueSnackbar('Invitation was already accepted', {
          variant: 'info',
        });
        router.replace(authRoutes.login, undefined, { shallow: true });
      }
    },
  });

  const methods = useForm<UserAcceptInviteFormInputType>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    resolver: zodResolver(userAcceptInviteFormInput),
    defaultValues: {
      fullName: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: UserAcceptInviteFormInputType) => {
    const fullNameSplit = data.fullName.split(' ');

    const firstName = fullNameSplit[0];
    const lastName = fullNameSplit[1];

    if (!firstName || !lastName) {
      methods.setError('fullName', {
        type: 'manual',
        message: 'Full name has to consist of first name and last name',
      });
      return;
    }

    await mutateAsync({
      firstName,
      lastName,
      password: data.password,
      invitationKey,
    });
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Get started</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="fullName" label="Full Name" />
      <RHFPasswordField name="password" label="Password" />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  if (!isValid) {
    return <SplashScreen />;
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {renderHead}
      <ErrorComponent />
      {renderForm}
    </FormProvider>
  );
};
