export const generateProfilePictureUrl = ({
  apiUrl,
  userId,
  avatarId,
}: {
  apiUrl: string;
  userId: string;
  avatarId: string | null;
}) => {
  if (!avatarId) {
    return undefined;
  }
  return `${apiUrl}/api/images/avatar/${userId}/${avatarId}`;
};
