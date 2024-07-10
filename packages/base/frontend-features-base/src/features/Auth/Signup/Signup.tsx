import { AuthErrorCode, authRoutes, useAuth } from '@base/auth-frontend-base';
import {
  ExpectedErrorCode,
  signupFormInput,
  SignupFormInputType,
} from '@base/common-base';
import { trackExceptionInSentry } from '@base/frontend-utils-base';
import FormProvider, {
  RHFPasswordField,
  RHFTextField,
} from '@base/ui-base/components/hook-form';
import RouterLink from '@base/ui-base/components/router-link';
import { useFormAlert } from '@base/ui-base/hooks';
import { Link, Stack, Typography } from '@base/ui-base/ui';
import { FirebaseError } from '@firebase/app';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { FieldPath, useForm } from 'react-hook-form';

export const Signup = () => {
  const { signup, isMutatingSignup } = useAuth();
  const { setErrorMsg, ErrorComponent } = useFormAlert();

  const methods = useForm<SignupFormInputType>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    resolver: zodResolver(signupFormInput),
    defaultValues: {
      confirmPassword: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },
  });

  const {
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (input: SignupFormInputType) => {
    try {
      const response = await signup(input);

      if (response?.result === 'error') {
        if (response.error.code === ExpectedErrorCode.FIELD_VALIDATION_ERROR) {
          return setError(
            response.error.field as FieldPath<SignupFormInputType>,
            response.error,
            { shouldFocus: true },
          );
        }
        setErrorMsg(response.error.message);
      }
    } catch (error) {
      const errorCode =
        error instanceof FirebaseError
          ? String(error.code).replace('auth/', '')
          : null;

      // TODO: This is potentially unsafe because bad actor
      // can know which emails already registered
      if (errorCode === AuthErrorCode.EMAIL_EXISTS) {
        setErrorMsg('This email address already in use');
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
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">Get started absolutely free</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Already have an account? </Typography>

        <Link
          href={authRoutes.login}
          component={RouterLink}
          variant="subtitle2"
        >
          Login
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 2.5,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="firstName" label="First name" />
        <RHFTextField name="lastName" label="Last name" />
      </Stack>

      <RHFTextField name="email" label="Email Address" />

      <RHFPasswordField name="password" label="Password" />

      <RHFPasswordField name="confirmPassword" label="Confirm Password" />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || isMutatingSignup}
      >
        Create account
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {renderHead}

      <ErrorComponent />
      {renderForm}

      {renderTerms}
    </FormProvider>
  );
};
