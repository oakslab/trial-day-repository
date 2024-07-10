# Email Providers

This folder contains all available email providers that your application may use. As of writing
this documentation, there are two supported providers:

- SendGrid - Web: https://sendgrid.com/, package: https://www.npmjs.com/package/@sendgrid/mail
- PostMark - Web: https://postmarkapp.com/, package: https://www.npmjs.com/package/postmark

## Selecting provider

You can select used provider by setting `EMAIL_PROVIDER` env variable to one of the options
from `EmailProvider` enum.

## SendGrid Configuration

If you want to use SendGrid as the emailing service, you have update your `.env` file with:

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=[your api key here]
```

You can obtain the API key from the Sendgrid dashboard.

## Postmark

If you want to use Postmark as the emailing service, you have update your `.env` file with:

```env
EMAIL_PROVIDER=postmark
POSTMARK_API_KEY=[your api key here]
```

You can obtain the API key from the Sendgrid dashboard.

## Writing your own email provider

### Step 1. Implement the provider

Create a new file named `[provider-name].provider` inside `/services/email/providers` folder.
Make sure that your class implements `EmailProviderBase`:

```typescript
import {
  EmailAttachment,
  EmailMessage,
  EmailProviderBase,
  EmailProviderConfig,
  EmailRecipient,
  EmailResult,
} from './email.provider';

export class [ProviderName]Provider implements EmailProviderBase {
  getName() {
    return 'provider-name'; // Make sure you update the name
  }

  async sendEmail(message: EmailMessage) {
    // Implement yourself
  }

  async sendManyEmails(messages: EmailMessage[]) {
    // Implement yourself
  }
}
```

Both `sendEmail` and `sendManyEmails` methods should accept emails without and with using
templates. If your email provider has different set of functions for emails using templates,
you can have a look at
`/services/email/providers/postmark.provider.ts`.

> Note: There are some handy utility functions you can use in `/services/email/utils.ts`

### Step 2. Prepare configuration

Update `apiEnv` in `/apps/api/src/lib/env.ts` and add any env variables that are required
for configuration of the provider.

> Note: If you are seeing `X is not listed as a dependency in turbo.json` eslint error,
> edit `/apps/api/turbo.json` file and add your env variables to `pipeline.build.env` array.
> Don't forget to restart Eslint server after you make the edits.

### Step 3. Register the provider

Open `index.ts` in `/services/email/providers` directory.

Edit `EmailProvider` enum and add your provider.

```typescript
export enum EmailProvider {
  Postmark = 'postmark',
  Sendgrid = 'sendgrid',

  // Newly added provider. Update to match.
  MyProvider = 'myprovider',
}
```

> Note: make sure you use lowercase string without any special characters and spaces
> as the value.

Then update the `getEmailProviderFromEnv` in such a way, that once `EMAIL_PROVIDER`
env variable contains the value you added to `EmailProvider` enum, an instance of the
provider class is returned.

For example, you added AWS SES. Your provider class is named `AwsSesProvider` and enum
value from `EmailProvider` is named `AwsSes`:

```typescript
export function getEmailProviderFromEnv(): EmailProviderBase {
  const providers = {
    [EmailProvider.Postmark]: new PostmarkProvider(),
    [EmailProvider.Sendgrid]: new SendgridProvider(),
    /// This is the newly added provider
    [EmailProvider.AwsSes]: new AwsSesProvider(),
  };

  if (!apiEnv.EMAIL_PROVIDER || !(apiEnv.EMAIL_PROVIDER in providers)) {
    throw new Error('No email provider configured.');
  }

  return providers[apiEnv.EMAIL_PROVIDER as EmailProvider];
}
```

### Step 4. Write test for your provider

Create `[provider].provider.test.ts` file with necessary tests. You can take inspiration
from `postmark.provider.test.ts` and `sendgrid.provider.test.ts`.

### Step 5. Update this document

Make sure you update this document with explanation how to setup the email provider you
just added.
