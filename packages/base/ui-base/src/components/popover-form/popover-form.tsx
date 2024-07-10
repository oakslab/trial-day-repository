import { useImperativeHandle, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import { useForm, FieldValues } from 'react-hook-form';
import FormProvider from '../hook-form';
import { PopoverFormProps } from './popover-form.types';

export function PopoverForm<T extends FieldValues>({
  open,
  onClose,
  onSubmit,
  defaultValues,
  formSchema,
  submitText,
  closeText,
  title,
  formRef,
  children,
}: PopoverFormProps<T>) {
  const [onSubmitPromiseLoading, setOnSubmitPromiseLoading] = useState(false);
  const methods = useForm<T>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
    values: defaultValues,
  });

  const handleClose = () => {
    methods.reset(defaultValues);
    onClose();
  };

  const handleFormSubmit = methods.handleSubmit((data) => {
    const submitPromise = onSubmit(data);
    if (submitPromise instanceof Promise) {
      setOnSubmitPromiseLoading(true);
      submitPromise.finally(() => setOnSubmitPromiseLoading(false));
    }
    return submitPromise;
  });

  useImperativeHandle(formRef, () => ({ form: methods }), [methods]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleFormSubmit}>
        <Stack>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{children?.(methods.formState)}</DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              {closeText}
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={methods.formState.isSubmitting || onSubmitPromiseLoading}
            >
              {submitText}
            </LoadingButton>
          </DialogActions>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}
