import { sendAuthEmailInputType, signupMutationInput } from '@base/common-base';
import { router } from '../../trpc';
import { publicProcedure, protectedProcedure } from '../../trpc/procedures';
import { SendResetPasswordEmailEnpoint } from './send-reset-password-email.endpoint';
import { SendVerificationEmailEndpoint } from './send-verification-email.endpoint';
import { SignupEndpoint } from './signup.endpoint';

export const authenticationRouter = router({
  me: protectedProcedure
    .meta({ requiredPermissions: ['self.read'] })
    .query(({ ctx }) => {
      return ctx.user;
    }),
  signup: publicProcedure
    .input(signupMutationInput)
    .mutation(SignupEndpoint.createEndpoint(SignupEndpoint)),
  sendResetPasswordEmail: publicProcedure
    .input(sendAuthEmailInputType)
    .mutation(
      SendResetPasswordEmailEnpoint.createEndpoint(
        SendResetPasswordEmailEnpoint,
      ),
    ),
  sendVerificationEmail: publicProcedure
    .input(sendAuthEmailInputType)
    .mutation(
      SendVerificationEmailEndpoint.createEndpoint(
        SendVerificationEmailEndpoint,
      ),
    ),
});
