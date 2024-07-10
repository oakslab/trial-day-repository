import { apiEnv } from '../../lib/env';
import { EmailService } from './email.service';
import { EmailMessage, EmailResult } from './providers/email.provider';

export type InviteUserData = {
  to: EmailMessage['to'];
  acceptInviteUrl: string;
};

export type ResetPasswordData = {
  to: EmailMessage['to'];
  resetPasswordUrl: string;
};

export type VerifyEmailData = {
  to: EmailMessage['to'];
  verifyEmailUrl: string;
};

export interface RequiredEmailsBase {
  sendInviteUserEmail: (data: InviteUserData) => Promise<EmailResult>;
}

export class EmailsRegistryBase implements RequiredEmailsBase {
  constructor(private readonly emailService: EmailService) {}

  sendInviteUserEmail(data: InviteUserData) {
    if (!apiEnv.FROM_EMAIL_ADDRESS) {
      throw new Error(
        'FROM_EMAIL_ADDRESS is not set in the environment variables',
      );
    }

    const emailMessage: EmailMessage = {
      to: data.to,
      from: apiEnv.FROM_EMAIL_ADDRESS,
      subject: 'You have been invited to join the team!',
      content: {
        type: 'html',
        value: `
          <p>You have been invited to join the team!</p>
          <p>Click <a href="${data.acceptInviteUrl}">here</a> to register.</p>
        `,
      },
    };

    return this.emailService.send(emailMessage);
  }

  sendResetPasswordEmail(data: ResetPasswordData) {
    if (!apiEnv.FROM_EMAIL_ADDRESS) {
      throw new Error(
        'FROM_EMAIL_ADDRESS is not set in the environment variables',
      );
    }

    const emailMessage: EmailMessage = {
      to: data.to,
      from: apiEnv.FROM_EMAIL_ADDRESS,
      subject: 'Reset your password',
      content: {
        type: 'html',
        value: `
          <p>Click <a href="${data.resetPasswordUrl}">here</a> to reset your password.</p>
          <p>If you didn't request it, please ignore this email.</p>
        `,
      },
    };

    return this.emailService.send(emailMessage);
  }

  sendVerificationEmail(data: VerifyEmailData) {
    if (!apiEnv.FROM_EMAIL_ADDRESS) {
      throw new Error(
        'FROM_EMAIL_ADDRESS is not set in the environment variables',
      );
    }

    const emailMessage: EmailMessage = {
      to: data.to,
      from: apiEnv.FROM_EMAIL_ADDRESS,
      subject: 'Verify your email',
      content: {
        type: 'html',
        value: `
          <p>Click <a href="${data.verifyEmailUrl}">here</a> to verify your email.</p>
          <p>If you didn't request it, please ignore this email.</p>
        `,
      },
    };

    return this.emailService.send(emailMessage);
  }
}
