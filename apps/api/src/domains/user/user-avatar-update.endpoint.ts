import { Result, UserAvatarUpdateInputType } from '@base/common-base';
import { TRPCError } from '@trpc/server';
import { nanoid } from 'nanoid';
import { Service } from 'typedi';
import { BaseEndpoint, EndpointParam } from '../../lib/base-endpoint';
import { LoggerService } from '../../services';
import { UserAssetsService } from '../../services/user/user-assets.service';
import { UserRepository } from './user.repo';

@Service()
export class UserAvatarUpdateEndpoint extends BaseEndpoint {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly userAssets: UserAssetsService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async execute({ input }: EndpointParam<UserAvatarUpdateInputType>) {
    const avatarLocation = 'public';
    const dbUser = await this.userRepo.findUnique({
      where: { id: input.userId },
    });

    if (!dbUser) {
      throw new TRPCError({
        message: 'User does not exist',
        code: 'NOT_FOUND',
      });
    }

    if (dbUser.avatarId) {
      try {
        await this.userAssets.deleteFileFromStorage({
          userId: dbUser.id,
          filename: dbUser.avatarId,
          location: avatarLocation,
        });
      } catch (e) {
        if (typeof e === 'object' && e && 'code' in e && e.code === 404) {
          this.logger.warn(
            'Previous avatar found in database but not in cloud storage',
            {
              userId: dbUser.id,
              avatarId: dbUser.avatarId,
            },
          );
        } else {
          throw e;
        }
      }
    }

    const avatarId = `${nanoid()}-${input.filename}`;

    await this.userRepo.update({
      where: { id: input.userId },
      data: { avatarId },
    });
    const signedUrl = await this.userAssets.generateSignedUrl({
      userId: dbUser.id,
      filename: avatarId,
      action: 'write',
      location: avatarLocation,
    });

    return Result.success({
      signedUrl,
      avatarId,
    });
  }
}
