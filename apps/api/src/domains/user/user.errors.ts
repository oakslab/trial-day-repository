import {
  FieldValidationError,
  InvalidStateError,
  NotFoundError,
} from '@base/common-base';

export const UserErrors = {
  EMAIL_EXISTS: new FieldValidationError('Email already registered', 'email'),
  USER_NOT_FOUND: new NotFoundError('User not found'),
  USER_ALREADY_DELETED_FROM_FIREBASE: new FieldValidationError(
    'User already deleted from Firebase',
    'email',
  ),
  USER_IS_ACTIVE_ALREADY: new InvalidStateError(
    'user-is-active-already',
    'User is active already',
  ),
  USER_IS_BANNED: new InvalidStateError('user-is-banned', 'User is banned'),
  INVITATION_KEY_EXPIRED: new InvalidStateError(
    'invitation-key-expired',
    'Invitation key expired',
  ),
  INVITATION_ALREADY_ACCEPTED: new InvalidStateError(
    'invitation-key-already-accepted',
    'Invitation already accepted',
  ),
  INVITATION_KEY_CORRUPTED: new InvalidStateError(
    'invitation-key-corrupted',
    'Invitation key was corrupted',
  ),
  USER_DID_NOT_ACCEPT_INVITE_YET: new InvalidStateError(
    'user-did-not-accept-invite-yet',
    'User did not accept an invititation yet',
  ),
};
