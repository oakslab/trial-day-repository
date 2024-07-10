import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormHelperText from '@mui/material/FormHelperText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useResponsive } from '../../hooks/use-responsive';

import Iconify from '../iconify';
import { DateRangePickerProps } from './types';

// ----------------------------------------------------------------------

export default function CustomDateRangePicker({
  title = 'Select date range',
  variant = 'input',
  //
  candidateRange,
  onChangeStartDate,
  onChangeEndDate,
  //
  open,
  error,
  onClose,
  onReset,
  onConfirm,
  //
  hasUnsavedChange,
}: DateRangePickerProps) {
  const mdUp = useResponsive('up', 'md');

  const isCalendarView = variant === 'calendar';

  return (
    <Dialog
      fullWidth
      maxWidth={isCalendarView ? false : 'xs'}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          ...(isCalendarView && {
            maxWidth: 720,
          }),
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

        <IconButton onClick={onClose} sx={{ height: 48, width: 48, right: 24 }}>
          <Iconify icon="mdi:close" width={24} />
        </IconButton>
      </Stack>

      <DialogContent
        sx={{
          ...(isCalendarView &&
            mdUp && {
              overflow: 'unset',
            }),
        }}
      >
        <Stack
          justifyContent="center"
          spacing={isCalendarView ? 3 : 2}
          direction={isCalendarView && mdUp ? 'row' : 'column'}
          sx={{ pt: 1 }}
        >
          {isCalendarView ? (
            <>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: 'divider',
                  borderStyle: 'dashed',
                }}
              >
                <DateCalendar
                  value={candidateRange.start}
                  onChange={onChangeStartDate}
                />
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: 'divider',
                  borderStyle: 'dashed',
                }}
              >
                <DateCalendar
                  value={candidateRange.end}
                  onChange={onChangeEndDate}
                />
              </Paper>
            </>
          ) : (
            <>
              <DatePicker
                label="Start date"
                value={candidateRange.start}
                onChange={onChangeStartDate}
              />

              <DatePicker
                label="End date"
                value={candidateRange.end}
                onChange={onChangeEndDate}
              />
            </>
          )}
        </Stack>

        {error && (
          <FormHelperText error sx={{ px: 2 }}>
            End date must be later than start date
          </FormHelperText>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onReset}>
          Reset
        </Button>

        <Button
          disabled={!hasUnsavedChange || error}
          variant="contained"
          onClick={() => onConfirm?.(candidateRange)}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
