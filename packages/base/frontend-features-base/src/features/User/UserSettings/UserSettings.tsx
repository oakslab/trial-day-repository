import { useCallback, useState } from 'react';
import { useAuth } from '@base/auth-frontend-base';
import { generateProfilePictureUrl } from '@base/auth-frontend-base/src/generateAvatar';
import { USER_AVATAR_MAX_FILE_SIZE } from '@base/common-base';
import { frontendEnv } from '@base/frontend-utils-base';
import { trpc } from '@base/frontend-utils-base';
import { ConfirmDialog } from '@base/ui-base/components/custom-dialog';
import { RHFUploadAvatar } from '@base/ui-base/components/hook-form';
import FormProvider from '@base/ui-base/components/hook-form';
import { LinearProgressWithLabel } from '@base/ui-base/components/progress';
import { useBoolean } from '@base/ui-base/hooks/use-boolean';
import { Box, Button, Card, Grid, Stack, Typography } from '@base/ui-base/ui';
import {
  uploadFileToSignedUrl,
  getFileExtension,
} from '@base/ui-base/utils/file';
import { fData } from '@base/ui-base/utils/format-number';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

export const UserSettings = () => {
  const utils = trpc.useUtils();
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();
  const { userProfile, logout, fetchUserProfile, avatarSrc } = useAuth();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const { mutateAsync: updateAvatar } = trpc.user.avatarUpdate.useMutation();
  const { mutateAsync: deleteUser } = trpc.user.delete.useMutation();

  const methods = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      avatar: avatarSrc,
    },
  });

  const { reset } = methods;

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file || !userProfile?.id) throw new Error('Upload failed');

      setUploadProgress(0);
      const res = await updateAvatar({
        filename: file.name,
        userId: userProfile.id,
      });
      await uploadFileToSignedUrl(
        file,
        res.data?.signedUrl ?? '',
        getFileExtension(file.name),
        (progress) => {
          setUploadProgress(progress);
        },
      );

      await utils.user.invalidate();
      const newUserResponse = await fetchUserProfile();
      reset({
        avatar: newUserResponse
          ? generateProfilePictureUrl({
              apiUrl: frontendEnv.NEXT_PUBLIC_API_URL,
              userId: newUserResponse.id,
              avatarId: newUserResponse.avatarId,
            })
          : undefined,
      });
      enqueueSnackbar('Avatar has been uploaded', { variant: 'success' });
    } catch {
      enqueueSnackbar('Avatar upload failed', { variant: 'error' });
    } finally {
      setUploadProgress(null);
    }
  }, []);

  const handleDelete = async () => {
    if (!userProfile?.id) {
      throw new Error('User not found');
    }
    await deleteUser({ id: userProfile.id });
    await logout();
    enqueueSnackbar('You deleted your account', { variant: 'success' });
  };

  return (
    // Note: in the future there might be form and onSubmit will be valuable, for now we don't need it
    <FormProvider methods={methods} onSubmit={() => {}}>
      <Grid
        mt={4}
        spacing={3}
        alignItems="center"
        container
        height="100%"
        justifyContent="center"
      >
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <Stack spacing={3}>
              <RHFUploadAvatar
                name="avatar"
                onDrop={handleDrop}
                maxFiles={1}
                maxSize={USER_AVATAR_MAX_FILE_SIZE}
                files={avatarSrc ? [avatarSrc] : []}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(USER_AVATAR_MAX_FILE_SIZE)}
                  </Typography>
                }
                disabled={uploadProgress != null}
              />
              {uploadProgress != null && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption">Uploading...</Typography>
                  <LinearProgressWithLabel
                    variant="determinate"
                    value={uploadProgress}
                  />
                </Box>
              )}
            </Stack>
            <ConfirmDialog
              open={confirm.value}
              onClose={confirm.onFalse}
              title="Remove your account?"
              content={
                <Typography>
                  Are you sure you want to remove your account? This is an
                  irreversible action and you'll be logged out of your account.
                </Typography>
              }
              customActionLabel="Remove"
              handleAction={handleDelete}
              actionButtonColor="error"
            />
            <Button
              variant="soft"
              color="error"
              sx={{ mt: 3 }}
              onClick={confirm.onTrue}
            >
              Remove your account
            </Button>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
};
