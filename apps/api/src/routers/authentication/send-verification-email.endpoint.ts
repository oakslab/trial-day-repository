import { Result, SendAuthEmailInputType } from '@base/common-base';
import { TRPCError } from '@trpc/server';
import { Service } from 'typedi';
import { UserRepository } from '../../domains/user/user.repo';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { LoggerService } from '../../services';
import { AuthService } from '../../services/auth';
import { EmailsRegistry } from '../../services/email/emails.registry';
import { getPortalUrlBasedOnRole } from '../../utils/helpers';

@Service()
export class SendVerificationEmailEndpoint extends BaseEndpoint {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
    private readonly emailsRegistry: EmailsRegistry,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  SUCCESS_RESPONSE =
    'Verification link was sent if user with this email registered.';

  async execute({ input }: EndpointParam<SendAuthEmailInputType>) {
    const user = await this.userRepo.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      return Result.success(this.SUCCESS_RESPONSE);
    }

    const link = await this.authService.generateVerifyEmailLink(
      user.email,
      getPortalUrlBasedOnRole(user.role),
    );

    const result = await this.emailsRegistry.sendVerificationEmail({
      to: [user.email],
      verifyEmailUrl: link,
    });

    if (!result.success) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to send verification email to ${user.email}. ${JSON.stringify(result, null, 2)}`,
      });
    }

    this.logger.info('Verification email was sent', {
      id: user.id,
      data: user,
    });

    return Result.success(user);
  }
}
