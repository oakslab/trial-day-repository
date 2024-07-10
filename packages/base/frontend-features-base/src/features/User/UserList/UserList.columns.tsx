import { generateProfilePictureUrl } from '@base/auth-frontend-base/src/generateAvatar';
import { UserListOutputType, isInvitationKeyExpired } from '@base/common-base';
import { frontendEnv } from '@base/frontend-utils-base';
import Label from '@base/ui-base/components/label';
import { Avatar, Stack, Typography } from '@base/ui-base/ui';
import { GridColDef } from '@base/ui-base/x-data-grid';
import { UserStatus } from 'database';

type UserType = UserListOutputType['items'][number];

type UserGridColDef = GridColDef<UserType> & {
  field: keyof UserType | 'actions';
};

export const columns: UserGridColDef[] = [
  {
    field: 'firstName',
    headerName: 'First name',
    renderCell: ({ row, value }) => {
      const avatarSrc = generateProfilePictureUrl({
        apiUrl: frontendEnv.NEXT_PUBLIC_API_URL,
        userId: row.id,
        avatarId: row.avatarId,
      });
      return (
        <Stack display="flex" direction="row" alignItems="center" height="100%">
          <Avatar src={avatarSrc} sx={{ width: 36, height: 36, mr: 2 }} />
          <Typography variant="body2">{value}</Typography>
        </Stack>
      );
    },
    sortable: true,
    filterable: false,
    resizable: false,
    minWidth: 200,
    flex: 1,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    sortable: true,
    filterable: false,
    minWidth: 200,
    flex: 1,
    resizable: false,
  },
  {
    field: 'email',
    headerName: 'Email',
    sortable: true,
    minWidth: 200,
    flex: 1,
    filterable: false,
    resizable: false,
  },
  {
    field: 'role',
    headerName: 'Role',
    sortable: false,
    filterable: false,
    resizable: false,
    minWidth: 200,
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row, value }) => {
      const hasInvitationKeyExpired = row.invitationKey
        ? isInvitationKeyExpired(row.invitationKey)
        : null;

      return (
        <Label
          variant="soft"
          color={
            (value === UserStatus.ACTIVE && 'success') ||
            (value === UserStatus.PENDING && hasInvitationKeyExpired
              ? 'error'
              : value === UserStatus.PENDING && 'warning') ||
            (value === UserStatus.BANNED && 'error') ||
            (value === UserStatus.REJECTED && 'error') ||
            'default'
          }
        >
          {value === UserStatus.PENDING && hasInvitationKeyExpired
            ? 'INVITATION EXPIRED'
            : value}
        </Label>
      );
    },
    sortable: false,
    filterable: false,
    resizable: false,
    minWidth: 200,
    flex: 1,
  },
];
