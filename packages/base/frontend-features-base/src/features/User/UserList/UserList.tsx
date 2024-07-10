import { useCallback, useMemo, useState } from 'react';
import {
  PermissionGuard,
  PermissionsList,
  useAuth,
  useMyPermissionsObject,
} from '@base/auth-frontend-base';
import {
  ExpectedErrorCode,
  UserCreateInputType,
  UserUpdateInputType,
} from '@base/common-base';
import {
  UserInviteInputType,
  userInviteInput,
} from '@base/common-base/src/domain/user/user-invite.types';
import {
  User,
  userInputSchema,
} from '@base/common-base/src/domain/user/user.types';
import { trpc } from '@base/frontend-utils-base';
import CustomBreadcrumbs from '@base/ui-base/components/custom-breadcrumbs';
import { ConfirmDialog } from '@base/ui-base/components/custom-dialog';
import { DatagridWrapper } from '@base/ui-base/components/datagrid';
import { ErrorSkeleton } from '@base/ui-base/components/error-skeleton';
import Iconify from '@base/ui-base/components/iconify';
import { PopoverForm } from '@base/ui-base/components/popover-form';
import { useBoolean } from '@base/ui-base/hooks/use-boolean';
import { useFormRef } from '@base/ui-base/hooks/use-form-ref';
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography,
} from '@base/ui-base/ui';
import { GridActionsCellItem, GridRowParams } from '@base/ui-base/x-data-grid';
import { UserStatus } from 'database';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { withErrorBoundary } from 'react-error-boundary';
import { useDataGrid } from '../../../hooks/use-datagrid';
import { UserForm } from '../UserForm';
import { UserInviteForm } from '../UserInviteForm/UserInviteForm';
import {
  useActOnBehalfMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useDisableUserMutation,
  useEnableUserMutation,
  useUpdateUserMutation,
  useInviteUserMutation,
  useResendInviteMutation,
} from './User.mutations';
import { columns } from './UserList.columns';
import { filtersConfig } from './UserList.constants';

const FORMS_GRID_TEMPLATE_COLUMNS = {
  xs: 'repeat(1, 1fr)',
  sm: 'repeat(2, 1fr)',
};

const USER_WAS_ALREADY_DELETED = 'User was already deleted';

const ALL_PERMISSIONS: PermissionsList = [
  'user.read',
  'user.create',
  'user.delete',
  'user.update',
  'user.ban',
  'user.invite',
  'user.actAs',
];

export const UserList = withErrorBoundary(
  () => {
    const { replace } = useRouter();
    const { userProfile } = useAuth();
    const confirm = useBoolean(false);
    const createUserModalState = useBoolean(false);
    const inviteUserModalState = useBoolean(false);
    const { enqueueSnackbar } = useSnackbar();
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
    const [userIdToDisable, setUserIdToDisable] = useState<string | null>(null);
    const [userIdToEnable, setUserIdToEnable] = useState<string | null>(null);
    const [userToUpdate, setUserToUpdate] = useState<User | null>(null);

    const permissions = useMyPermissionsObject(ALL_PERMISSIONS);

    const datagrid = useDataGrid(trpc.user.list.useQuery, filtersConfig);

    const { mutateAsync: deleteUser, isLoading: isDeleting } =
      useDeleteUserMutation();
    const { mutateAsync: updateUser, isLoading: isUpdating } =
      useUpdateUserMutation();
    const { mutateAsync: createUser } = useCreateUserMutation();
    const { mutateAsync: disableUser, isLoading: isDisabling } =
      useDisableUserMutation();
    const { mutateAsync: enableUser, isLoading: isEnabling } =
      useEnableUserMutation();
    const { mutateAsync: inviteUser } = useInviteUserMutation();
    const { mutateAsync: resendInvite } = useResendInviteMutation({
      onSuccess: (data) => {
        if (
          data.result === 'error' &&
          data.error.code === ExpectedErrorCode.NOT_FOUND_ERROR
        ) {
          enqueueSnackbar(USER_WAS_ALREADY_DELETED, { variant: 'error' });
          datagrid.refetchQuery();
        }

        if (data.result === 'success') {
          enqueueSnackbar('Invitation resent successfully', {
            variant: 'success',
          });
        }
      },
    });
    const { mutateAsync: actOnBehalf } = useActOnBehalfMutation();

    const createFormRef = useFormRef<UserCreateInputType>();
    const updateFormRef = useFormRef<UserUpdateInputType>();
    const inviteFormRef = useFormRef<UserInviteInputType>();

    const handleCreateUser = async (data: UserCreateInputType) => {
      try {
        const response = await createUser(data);
        if (
          response.result === 'error' &&
          response.error.code === ExpectedErrorCode.FIELD_VALIDATION_ERROR
        ) {
          createFormRef.current?.form.setError(response.error.field, {
            message: response.error.message,
          });
          enqueueSnackbar(response.error.message, { variant: 'error' });
        } else {
          enqueueSnackbar('User created successfully', { variant: 'success' });
          createFormRef.current?.form.reset();
          createUserModalState.onFalse();
        }
      } catch {
        enqueueSnackbar('Failed to create user', { variant: 'error' });
      }
    };

    const handleUpdateUser = async (data: UserUpdateInputType) => {
      try {
        const response = await updateUser(data);
        if (response.result === 'error') {
          if (
            response.error.code === ExpectedErrorCode.FIELD_VALIDATION_ERROR
          ) {
            updateFormRef.current?.form.setError(response.error.field, {
              message: response.error.message,
            });
            enqueueSnackbar(response.error.message, { variant: 'error' });
          } else if (
            response.error.code === ExpectedErrorCode.NOT_FOUND_ERROR
          ) {
            enqueueSnackbar(USER_WAS_ALREADY_DELETED, { variant: 'error' });
            datagrid.refetchQuery();

            setUserToUpdate(null);
          }
        } else {
          enqueueSnackbar('User updated successfully', { variant: 'success' });
          updateFormRef.current?.form.reset();
          setUserToUpdate(null);
        }
      } catch {
        enqueueSnackbar('Failed to update user', { variant: 'error' });
      }
    };

    const handleDeleteUser = async () => {
      try {
        if (!userIdToDelete) return;

        const response = await deleteUser({ id: userIdToDelete });

        if (
          response.result === 'error' &&
          response.error.code === ExpectedErrorCode.NOT_FOUND_ERROR
        ) {
          enqueueSnackbar(USER_WAS_ALREADY_DELETED, { variant: 'error' });
          datagrid.refetchQuery();

          setUserIdToDelete(null);
        } else {
          setUserIdToDelete(null);
          enqueueSnackbar('User deleted successfully', { variant: 'success' });
        }
      } catch {
        enqueueSnackbar('Failed to delete user', { variant: 'error' });
      }
    };

    const handleInviteUser = async (data: UserInviteInputType) => {
      try {
        const response = await inviteUser(data);
        if (
          response.result === 'error' &&
          response.error.code === ExpectedErrorCode.FIELD_VALIDATION_ERROR
        ) {
          inviteFormRef.current?.form.setError(response.error.field, {
            message: response.error.message,
          });
          enqueueSnackbar(response.error.message, { variant: 'error' });
        } else {
          enqueueSnackbar('User invited successfully', { variant: 'success' });
          inviteFormRef.current?.form.reset();
          inviteUserModalState.onFalse();
        }
      } catch {
        enqueueSnackbar('Failed to invite user', { variant: 'error' });
      }
    };

    const handleDisableUser = async () => {
      try {
        if (!userIdToDisable) return;

        const response = await disableUser({ id: userIdToDisable });

        if (response.result === 'success') {
          enqueueSnackbar('User disabled successfully', { variant: 'success' });
        } else if (response.error.code === ExpectedErrorCode.NOT_FOUND_ERROR) {
          enqueueSnackbar(USER_WAS_ALREADY_DELETED, { variant: 'error' });
          datagrid.refetchQuery();

          setUserIdToDisable(null);
          confirm.onFalse();
        }
      } catch {
        enqueueSnackbar('Failed to disable user', { variant: 'error' });
        datagrid.refetchQuery();
      } finally {
        setUserIdToDisable(null);
        confirm.onFalse();
      }
    };

    const handleEnableUser = async () => {
      try {
        if (!userIdToEnable) return;

        const response = await enableUser({ id: userIdToEnable });

        if (response.result === 'success') {
          enqueueSnackbar('User enabled successfully', { variant: 'success' });
        } else if (response.error.code === ExpectedErrorCode.NOT_FOUND_ERROR) {
          enqueueSnackbar(USER_WAS_ALREADY_DELETED, { variant: 'error' });
          datagrid.refetchQuery();

          setUserIdToEnable(null);
          confirm.onFalse();
        }
      } catch {
        enqueueSnackbar('Failed to enable user', { variant: 'error' });
        datagrid.refetchQuery();
      } finally {
        setUserIdToEnable(null);
        confirm.onFalse();
      }
    };

    const handleActOnBehalf = useCallback(
      async (id: string) => {
        try {
          const response = await actOnBehalf({ id });
          if (response.result === 'error') {
            if (response.error.code === ExpectedErrorCode.NOT_FOUND_ERROR) {
              enqueueSnackbar(USER_WAS_ALREADY_DELETED, { variant: 'error' });
            } else if (
              response.error.code === ExpectedErrorCode.INVALID_STATE_ERROR &&
              response.error.subcode === 'user-did-not-accept-invite-yet'
            ) {
              enqueueSnackbar('User did not accept the invitation yet', {
                variant: 'error',
              });
            }
          } else {
            window.open(response.data.url, '_blank')?.focus();
          }
        } catch {
          enqueueSnackbar('Failed to act on behalf the user', {
            variant: 'error',
          });
        }
      },
      [actOnBehalf, enqueueSnackbar],
    );

    const getRowActions = useCallback(
      (params: GridRowParams<User>) => {
        const actions = permissions['user.update']
          ? [
              <GridActionsCellItem
                label="Edit"
                icon={<Iconify icon="solar:pen-bold" mr={-1} />}
                onClick={() => setUserToUpdate(params.row)}
                showInMenu
              />,
            ]
          : [];

        const isMe = params.row.id === userProfile?.id;

        if (!isMe) {
          if (
            params.row.status === UserStatus.PENDING &&
            permissions['user.invite']
          ) {
            actions.push(
              <GridActionsCellItem
                label="Resend Invite"
                icon={<Iconify icon="ri:send-plane-fill" mr={-1} />}
                onClick={() =>
                  resendInvite({
                    id: params.row.id,
                  })
                }
                showInMenu
              />,
            );
          }

          if (
            params.row.status !== UserStatus.PENDING &&
            permissions['user.actAs']
          ) {
            actions.push(
              <GridActionsCellItem
                label="Log in as this user"
                icon={<Iconify icon="solar:key-square-bold" mr={-1} />}
                onClick={() => handleActOnBehalf(params.row.id)}
                showInMenu
              />,
            );
          }

          if (permissions['user.ban']) {
            actions.push(
              params.row.status === UserStatus.BANNED ? (
                <GridActionsCellItem
                  label="Enable"
                  icon={<Iconify icon="raphael:check" mr={-1} />}
                  onClick={() => setUserIdToEnable(params.row.id)}
                  showInMenu
                />
              ) : (
                <GridActionsCellItem
                  label="Disable"
                  icon={<Iconify icon="raphael:no" mr={-1} />}
                  onClick={() => setUserIdToDisable(params.row.id)}
                  showInMenu
                />
              ),
            );
          }

          if (permissions['user.delete']) {
            actions.push(
              <GridActionsCellItem
                label="Delete"
                icon={<Iconify icon="solar:trash-bin-trash-bold" mr={-1} />}
                sx={{ color: 'error.main' }}
                onClick={() => setUserIdToDelete(params.row.id)}
                showInMenu
              />,
            );
          }
        }

        return actions;
      },
      [
        permissions,
        userProfile,
        resendInvite,
        handleActOnBehalf,
        setUserToUpdate,
        setUserIdToEnable,
        setUserIdToDisable,
        setUserIdToDelete,
      ],
    );

    const datagridProps = useMemo(() => {
      return {
        ...datagrid.dataGridProps,
        checkboxSelection: false,
        columns: [
          ...columns,
          {
            field: 'actions',
            type: 'actions' as const,
            resizable: false,
            sortable: false,
            width: 50,
            getActions: getRowActions,
          },
        ],
        pageSizeOptions: [5, 10, 25],
      };
    }, [datagrid.dataGridProps, getRowActions]);

    if (!permissions['user.read']) {
      replace('/403');
    }

    return (
      <Container sx={{ marginTop: '24px' }}>
        <CustomBreadcrumbs
          sx={{ padding: '0 24px', mb: 4 }}
          heading="Users"
          links={[]}
          action={
            <Stack direction="row" spacing={2}>
              <PermissionGuard permissions={['user.invite']}>
                <Button
                  onClick={inviteUserModalState.onTrue}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:invite-line" />}
                >
                  Invite User
                </Button>
              </PermissionGuard>
              <PermissionGuard permissions={['user.create']}>
                <Button
                  onClick={createUserModalState.onTrue}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  New User
                </Button>
              </PermissionGuard>
            </Stack>
          }
        />
        <Stack sx={{ width: '100%' }}>
          <Container maxWidth="lg">
            <Card sx={{ p: 0 }}>
              {datagrid.filtersNode}

              <DatagridWrapper
                {...datagrid.dataGridWrapperProps}
                dataGridProps={datagridProps}
                isLoading={
                  datagrid.isFetching ||
                  isDeleting ||
                  isUpdating ||
                  isDisabling ||
                  isEnabling
                }
              />

              <ConfirmDialog
                open={Boolean(userIdToDelete)}
                onClose={() => setUserIdToDelete(null)}
                title="Delete"
                content={
                  <Typography>
                    Are you sure you want to delete this user?
                  </Typography>
                }
                customActionLabel="Delete"
                handleAction={handleDeleteUser}
                actionButtonColor="error"
                confirmActionLoading={isDeleting}
              />
              <ConfirmDialog
                open={Boolean(userIdToDisable)}
                onClose={() => setUserIdToDisable(null)}
                title="Disable"
                content={
                  <Typography>
                    Are you sure you want to disable this user?
                  </Typography>
                }
                customActionLabel="Disable"
                handleAction={handleDisableUser}
                actionButtonColor="inherit"
                confirmActionLoading={isDisabling}
              />
              <ConfirmDialog
                open={Boolean(userIdToEnable)}
                onClose={() => setUserIdToEnable(null)}
                title="Enable"
                content={
                  <Typography>
                    Are you sure you want to enable this user?
                  </Typography>
                }
                customActionLabel="Enable"
                handleAction={handleEnableUser}
                actionButtonColor="inherit"
                confirmActionLoading={isEnabling}
              />
              <PopoverForm
                open={Boolean(userToUpdate)}
                onClose={() => setUserToUpdate(null)}
                onSubmit={(data) => {
                  return handleUpdateUser({ id: userToUpdate?.id, ...data });
                }}
                defaultValues={userToUpdate ?? undefined}
                formSchema={userInputSchema}
                closeText="Cancel"
                submitText="Update"
                title="Update user"
                formRef={updateFormRef}
              >
                {(formState) => (
                  <Box
                    pt={2}
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={FORMS_GRID_TEMPLATE_COLUMNS}
                  >
                    <UserForm formState={formState} />
                  </Box>
                )}
              </PopoverForm>
            </Card>
          </Container>
        </Stack>
        <PopoverForm
          open={createUserModalState.value}
          onClose={createUserModalState.onFalse}
          onSubmit={handleCreateUser}
          formSchema={userInputSchema}
          closeText="Cancel"
          submitText="Create"
          title="Create user"
          formRef={createFormRef}
        >
          {(formState) => (
            <Box
              pt={2}
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={FORMS_GRID_TEMPLATE_COLUMNS}
            >
              <UserForm formState={formState} />
            </Box>
          )}
        </PopoverForm>
        <PopoverForm
          open={inviteUserModalState.value}
          onClose={inviteUserModalState.onFalse}
          onSubmit={handleInviteUser}
          formSchema={userInviteInput}
          closeText="Cancel"
          submitText="Send Invite"
          title="Invite user"
          formRef={inviteFormRef}
        >
          {(formState) => (
            <Box
              pt={2}
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={FORMS_GRID_TEMPLATE_COLUMNS}
            >
              <UserInviteForm formState={formState} />
            </Box>
          )}
        </PopoverForm>
      </Container>
    );
  },
  { FallbackComponent: ErrorSkeleton },
);
