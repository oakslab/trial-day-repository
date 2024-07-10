import { useState, useCallback } from 'react';
import { DateRange, DateRangePickerProps } from './types';
import { getHumanReadableRange } from './utils';

// ----------------------------------------------------------------------

type ReturnType = DateRangePickerProps;

export default function useDateRangePicker(
  currentRange: DateRange,
): ReturnType {
  const [open, setOpen] = useState(false);

  const [candidateRange, setCandidateRange] = useState<DateRange>(currentRange);

  const error =
    candidateRange.start && candidateRange.end
      ? new Date(candidateRange.start).getTime() >
        new Date(candidateRange.end).getTime()
      : false;

  const onOpen = useCallback(() => {
    setOpen(true);
    setCandidateRange(currentRange);
  }, [currentRange]);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onChangeStartDate = useCallback((newValue: Date | null) => {
    setCandidateRange(({ end }) => ({ start: newValue, end }));
  }, []);

  const onChangeEndDate = useCallback(
    (newValue: Date | null) => {
      setCandidateRange(({ start }) => ({ start, end: newValue }));
    },
    [error],
  );

  const onReset = useCallback(() => {
    setCandidateRange({ start: null, end: null });
  }, []);

  const label = getHumanReadableRange(currentRange);

  const hasUnsavedChange =
    candidateRange.start !== currentRange.start ||
    candidateRange.end !== currentRange.end;

  return {
    candidateRange,
    onChangeStartDate,
    onChangeEndDate,
    //
    error,
    open,
    onOpen,
    onClose,
    onReset,
    //
    label,
    hasUnsavedChange,
  };
}
