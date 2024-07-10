import type { Permissions } from '@base/common-base';
import type { User } from 'database';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ContainerInstance } from 'typedi';

export interface RequestContext extends Context {
  req: NextApiRequest;
  res: NextApiResponse;
}

export type UserFromContext = Exclude<User & { originalUserId?: string }, null>;

export interface Context {
  referer?: string;
  container: ContainerInstance;
  user: UserFromContext | null;
}

export interface ProtectedContext extends Context {
  user: UserFromContext;
}

export interface EndpointMeta {
  requiredPermissions?: Permissions;
}
