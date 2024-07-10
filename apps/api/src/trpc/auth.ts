import { TRPCError } from '@trpc/server';
import { NextApiRequest } from 'next';
import { ContainerInstance } from 'typedi';
import { UserRepository } from '../domains/user/user.repo';
import { AuthService } from '../services/auth';
import { GcpAuthService } from '../services/gcp-auth';

export const authenticateUserIfTokenExists = async (
  request: NextApiRequest,
  container: ContainerInstance,
) => {
  const authorization = request.headers.authorization;
  if (!authorization) {
    return null;
  }

  const authenticationService = container.get(AuthService);
  const userRepo = container.get(UserRepository);

  const token = authenticationService.extractToken(authorization);
  const decodedToken = await authenticationService.verifyToken(token);

  const user = await userRepo.findUnique({
    where: { uid: decodedToken.uid },
  });

  return user
    ? {
        ...user,
        ...('original_user_id' in decodedToken && {
          originalUserId: decodedToken.original_user_id,
        }),
      }
    : null;
};

export const validateCloudTaskRequest = async (
  request: NextApiRequest,
  container: ContainerInstance,
) => {
  try {
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new Error('Missing authorization header');
    }

    const gcpAuthService = container.get(GcpAuthService);

    const token = gcpAuthService.extractToken(authorization);
    await gcpAuthService.verifyCloudTaskIdToken(token);
  } catch (error) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
};
