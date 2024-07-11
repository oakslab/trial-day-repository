import {
  Box,
  Grid,
  IconButton,
  Modal,
  Stack,
  Typography,
} from '@base/ui-base/ui';
import { postCreateInput, PostCreateInputType } from 'common';
import { useForm } from 'react-hook-form';

import { Close } from '@base/ui-base/icons';
import { trpc } from '@base/frontend-utils-base';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@base/auth-frontend-base';
import FormProvider, { RHFTextField } from '@base/ui-base/components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';

export const AddPostModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const utils = trpc.useUtils();
  const { mutateAsync } = trpc.post.create.useMutation({
    onSuccess: () => {
      utils.post.list.invalidate();
    },
  });

  const style = {
    position: 'absolute' as 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 500,
    width: '100%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
  };

  const methods = useForm<PostCreateInputType>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    resolver: zodResolver(postCreateInput),
    defaultValues: {
      content: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: PostCreateInputType) => {
    console.log({ data });
    const payload = { ...data };
    try {
      mutateAsync(payload);

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">What's on your mind today?</Typography>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Grid>
            <RHFTextField
              multiline
              rows={4}
              name="content"
              placeholder="express yourself however you like,  but be respectful."
              required
            />
            <LoadingButton
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Post
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Box>
    </Modal>
  );
};
