import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { ConfirmDialogProps } from './types';

export default function ConfirmDialog({
  title,
  content,
  open,
  onClose,
  handleAction,
  customActionLabel,
  customCloseLabel,
  actionButtonColor,
  confirmActionLoading,
  ...other
}: ConfirmDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && (
        <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>
      )}

      <DialogActions>
        <LoadingButton
          variant="contained"
          color={actionButtonColor}
          onClick={handleAction}
          loading={confirmActionLoading}
        >
          {customActionLabel || 'Confirm'}
        </LoadingButton>

        <Button variant="outlined" color="inherit" onClick={onClose}>
          {customCloseLabel || 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
