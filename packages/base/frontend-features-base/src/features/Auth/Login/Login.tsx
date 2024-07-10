import { AuthErrorCode, authRoutes, useAuth } from '@base/auth-frontend-base';
import { loginMutationInput, LoginMutationInputType } from '@base/common-base';
import { trackExceptionInSentry } from '@base/frontend-utils-base';
import FormProvider, {
  RHFPasswordField,
  RHFTextField,
} from '@base/ui-base/components/hook-form';
import RouterLink from '@base/ui-base/components/router-link';
import { useFormAlert } from '@base/ui-base/hooks';
import { Stack, Typography } from '@base/ui-base/ui';
import { FirebaseError } from '@firebase/app';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import { UserRole } from 'database';
import { useForm } from 'react-hook-form';

const INVALID_CREDENTIALS_ERRORS = [
  AuthErrorCode.INVALID_EMAIL,
  AuthErrorCode.INVALID_PASSWORD,
  AuthErrorCode.INVALID_CREDENTIAL,
  AuthErrorCode.USER_NOT_FOUND,
];

type Props = {
  expectedUserRoles: UserRole[];
  hideRegisterLink?: boolean;
};

export const Login = ({ expectedUserRoles, hideRegisterLink }: Props) => {
  const { login } = useAuth();
  const { setErrorMsg, ErrorComponent } = useFormAlert();

  const methods = useForm<LoginMutationInputType>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    resolver: zodResolver(loginMutationInput),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: LoginMutationInputType) => {
    try {
      await login(data, expectedUserRoles);
    } catch (error) {
      const errorCode =
        error instanceof FirebaseError
          ? String(error.code).replace('auth/', '')
          : null;

      if (INVALID_CREDENTIALS_ERRORS.find((e) => e === errorCode)) {
        setErrorMsg('Invalid credentials');
      } else {
        trackExceptionInSentry(error);
        setErrorMsg(
          error instanceof FirebaseError
            ? error.message
            : 'Something went wrong. Please try again later.',
        );
      }
    }
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in to Minimal</Typography>

      {!hideRegisterLink && (
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">New user?</Typography>

          <Link
            component={RouterLink}
            href={authRoutes.signup}
            variant="subtitle2"
          >
            Create an account
          </Link>
        </Stack>
      )}
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="email" label="Email Address" />
      <RHFPasswordField name="password" label="Password" />

      <Link
        component={RouterLink}
        href={authRoutes.resetPasswordRequest}
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end' }}
      >
        Forgot password?
      </Link>
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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {renderHead}
      <ErrorComponent />
      {renderForm}
    </FormProvider>
  );
};
