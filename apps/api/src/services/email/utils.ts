import { EmailRecipient } from './providers/email.provider';

// Recipient can be either a string (representing the email address) or an object that has more
// information than just the email address.
// This function will return email address for both cases.
export function getEmailFromEmailRecipient(recipient: EmailRecipient): string {
  if (typeof recipient === 'string') {
    return recipient;
  }

  return recipient.email;
}

// Recipient can be either a string (representing the email address) or an object that has more
// information than just the email address.
// This function will return email with the name (Name <email@server.com>) for both cases.
export function getEmailWithNameFromEmailRecipient(
  recipient: EmailRecipient,
): string {
  if (typeof recipient === 'string') {
    return recipient;
  }

  return `${recipient.name} <${recipient.email}>`;
}
