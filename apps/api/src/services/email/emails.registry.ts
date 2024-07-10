import { Service } from 'typedi';
import { EmailService } from './email.service';
import { EmailsRegistryBase, RequiredEmailsBase } from './emails.registry.base';

interface RequiredEmails extends RequiredEmailsBase {}

@Service()
export class EmailsRegistry
  extends EmailsRegistryBase
  implements RequiredEmails
{
  constructor(emailService: EmailService) {
    super(emailService);
  }
}
