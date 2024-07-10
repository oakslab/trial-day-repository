type AcceptInvitationUrl = `${string}/invitation/${string}/accept`;

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
export const ACCEPT_INVITATION_ROUTE_PREFIX = '/invitation';

export const generateAcceptInvitationUrl = (
  websiteUrl: string,
  invitationKey: string,
): AcceptInvitationUrl => {
  return `${websiteUrl}${ACCEPT_INVITATION_ROUTE_PREFIX}/${invitationKey}/accept`;
};

export const injectClaimsToInvitationKey = (
  bareInvitationKey: string,
  claims: {
    expiresInDays: number;
    email: string;
  },
) => {
  const expiresAt = new Date(
    new Date().getTime() + claims.expiresInDays * DAY_IN_MILLISECONDS,
  );

  const expiresAtTimestamp = expiresAt.getTime();

  return Buffer.from(
    `${expiresAtTimestamp.toString()}#${claims.email}#${bareInvitationKey}`,
  ).toString('base64');
};

export const extractClaimsFromInvitationKey = (invitationKey: string) => {
  const decoded = Buffer.from(invitationKey, 'base64').toString('utf-8');
  const [expiresAtTimestamp, email, bareInvitationKey] = decoded.split('#');
  const numericExpiresAtTimestamp = Number(expiresAtTimestamp);

  if (
    !expiresAtTimestamp ||
    !email ||
    !bareInvitationKey ||
    isNaN(numericExpiresAtTimestamp)
  ) {
    throw new Error(
      `Invitation key was corrupted. ${
        !expiresAtTimestamp
          ? 'Missing expiresAtTimestamp'
          : !email
            ? 'Missing email'
            : !bareInvitationKey
              ? 'Missing bareInvitationKey'
              : 'Invalid expiresAtTimestamp'
      }. Decoded: ${decoded}`,
    );
  }

  return {
    email,
    expiresAt: new Date(numericExpiresAtTimestamp),
    bareInvitationKey,
  };
};

export const isInvitationKeyExpired = (invitationKey: string): boolean => {
  const { expiresAt } = extractClaimsFromInvitationKey(invitationKey);

  return expiresAt.getTime() < Date.now();
};
