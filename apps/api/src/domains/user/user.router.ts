import {
  userListInput,
  userDeleteInput,
  userInviteInput,
  userUpdateInput,
  userAvatarUpdateInputSchema,
  userDisableInput,
  userEnableInput,
  userCreateInput,
  userAcceptInviteInput,
  userValidateInvitationKeyInput,
  userResendInviteInput,
  userActOnBehalfInput,
  userUpdateSelfInput,
} from '@base/common-base';
import { UserListEndpoint } from '../../domains/user/user-list.endpoint';
import { procedure, router } from '../../trpc';
import { adminProcedure, protectedProcedure } from '../../trpc/procedures';
import { UserAcceptInviteEndpoint } from './user-accept-invite.endpoint';
import { UserActOnBehalfEndpoint } from './user-act-on-behalf.endpoint';
import { UserAvatarUpdateEndpoint } from './user-avatar-update.endpoint';
import { UserCreateEndpoint } from './user-create.endpoint';
import { UserDeleteEndpoint } from './user-delete.endpoint';
import { UserDisableEndpoint } from './user-disable.endpoint';
import { UserEnableEndpoint } from './user-enable.endpoint';
import { UserInviteEndpoint } from './user-invite.endpoint';
import { UserListCountByStatusEndpoint } from './user-list-count.endpoint';
import { UserResendInviteEndpoint } from './user-resend-invite.endpoint';
import { UserUpdateSelfEndpoint } from './user-update-self.endpoint';
import { UserUpdateEndpoint } from './user-update.endpoint';
import { UserValidateInvitationKeyEndpoint } from './user-validate-invitation-key.endpoint';

export const userRouter = router({
  update: adminProcedure
    .meta({ requiredPermissions: ['user.update'] })
    .input(userUpdateInput)
    .mutation(UserUpdateEndpoint.createEndpoint(UserUpdateEndpoint)),
  listCountByStatus: adminProcedure
    .meta({ requiredPermissions: ['user.read'] })
    .query(
      UserListCountByStatusEndpoint.createEndpoint(
        UserListCountByStatusEndpoint,
      ),
    ),
  list: adminProcedure
    .meta({ requiredPermissions: ['user.read'] })
    .input(userListInput)
    .query(UserListEndpoint.createEndpoint(UserListEndpoint)),
  delete: adminProcedure
    .meta({ requiredPermissions: ['user.delete'] })
    .input(userDeleteInput)
    .mutation(UserDeleteEndpoint.createEndpoint(UserDeleteEndpoint)),
  create: adminProcedure
    .meta({ requiredPermissions: ['user.create'] })
    .input(userCreateInput)
    .mutation(UserCreateEndpoint.createEndpoint(UserCreateEndpoint)),
  updateSelf: protectedProcedure
    .meta({ requiredPermissions: ['self.update'] })
    .input(userUpdateSelfInput)
    .mutation(UserUpdateSelfEndpoint.createEndpoint(UserUpdateSelfEndpoint)),
  invite: adminProcedure
    .meta({ requiredPermissions: ['user.invite'] })
    .input(userInviteInput)
    .mutation(UserInviteEndpoint.createEndpoint(UserInviteEndpoint)),
  resendInvite: adminProcedure
    .meta({ requiredPermissions: ['user.invite'] })
    .input(userResendInviteInput)
    .mutation(
      UserResendInviteEndpoint.createEndpoint(UserResendInviteEndpoint),
    ),
  acceptInvite: procedure
    .input(userAcceptInviteInput)
    .mutation(
      UserAcceptInviteEndpoint.createEndpoint(UserAcceptInviteEndpoint),
    ),
  validateInvitationKey: procedure
    .input(userValidateInvitationKeyInput)
    .query(
      UserValidateInvitationKeyEndpoint.createEndpoint(
        UserValidateInvitationKeyEndpoint,
      ),
    ),
  avatarUpdate: protectedProcedure
    .meta({ requiredPermissions: ['self.update'] })
    .input(userAvatarUpdateInputSchema)
    .mutation(
      UserAvatarUpdateEndpoint.createEndpoint(UserAvatarUpdateEndpoint),
    ),
  disable: adminProcedure
    .meta({ requiredPermissions: ['user.ban'] })
    .input(userDisableInput)
    .mutation(UserDisableEndpoint.createEndpoint(UserDisableEndpoint)),
  enable: adminProcedure
    .meta({ requiredPermissions: ['user.ban'] })
    .input(userEnableInput)
    .mutation(UserEnableEndpoint.createEndpoint(UserEnableEndpoint)),
  actOnBehalf: adminProcedure
    .meta({ requiredPermissions: ['user.actAs'] })
    .input(userActOnBehalfInput)
    .mutation(UserActOnBehalfEndpoint.createEndpoint(UserActOnBehalfEndpoint)),
});
