import { Constructable } from 'typedi';
import { apiEnv } from '../../../lib/env';
import { ConsoleEmailProvider } from './console-email.provider';
import { EmailProviderBase } from './email.provider';
import { PostmarkProvider } from './postmark.provider';
import { SendgridProvider } from './sendgrid.provider';
import { TestEmailProvider } from './test-email.provider';

export enum EmailProviderEnum {
  Postmark = 'postmark',
  Sendgrid = 'sendgrid',
  Console = 'console', // Only for local development
  Test = 'test', // Only used in tests
}

export function getEmailProviderFromEnv(): Constructable<EmailProviderBase> {
  console.log('getting email provider from env', apiEnv.EMAIL_PROVIDER);

  const providers = {
    [EmailProviderEnum.Postmark]: PostmarkProvider,
    [EmailProviderEnum.Sendgrid]: SendgridProvider,
    [EmailProviderEnum.Console]: ConsoleEmailProvider, // Only for local development
    [EmailProviderEnum.Test]: TestEmailProvider, // Only used in tests
  };

  if (!apiEnv.EMAIL_PROVIDER || !(apiEnv.EMAIL_PROVIDER in providers)) {
    throw new Error('No email provider configured.');
  }

  return providers[apiEnv.EMAIL_PROVIDER as EmailProviderEnum];
}
