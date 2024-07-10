import { UserValidateInvitationKeyInputType } from '@base/common-base';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { UserInvitationService } from './user-invitation.service';

@Service()
export class UserValidateInvitationKeyEndpoint extends BaseEndpoint {
  constructor(private readonly userInvitationService: UserInvitationService) {
    super();
  }

  async execute({ input }: EndpointParam<UserValidateInvitationKeyInputType>) {
    return await this.userInvitationService.validateAndParseInvitationKey(
      input.invitationKey,
    );
  }
}
