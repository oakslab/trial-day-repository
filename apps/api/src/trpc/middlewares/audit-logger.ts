import { middleware } from '..';
import { PrismaService } from '../../lib/db/prisma';
import { logger } from '../../services';

export const auditLogMiddleware = middleware(async (opts) => {
  const { ctx, path, next } = opts;
  const result = await next();

  const prisma = opts.ctx.container.get(PrismaService);

  const user = ctx.user;
  let ipAddress =
    ctx.req.headers['x-forwarded-for'] || ctx.req.socket.remoteAddress;

  if (Array.isArray(ipAddress)) {
    ipAddress = ipAddress[0];
  }

  try {
    await prisma.auditLog.create({
      data: {
        operation: path,
        userIp: ipAddress,
        userEmail: user?.email ?? 'N/A',
        timestamp: new Date(),
        accessLevel: user?.role ?? 'N/A',
      },
    });
  } catch (e) {
    logger.error(
      `Failed to create audit log: ${e instanceof Error ? e.message : e}`,
      {
        operation: path,
        userIp: ipAddress,
        userEmail: user?.email ?? 'N/A',
        accessLevel: user?.role ?? 'N/A',
        originalUserId: user?.originalUserId,
      },
    );
  }

  return result;
});
