// ----------------------------------------------------------------------

export type DateNullable = Date | null;

export type DateRange = {
  start: DateNullable;
  end: DateNullable;
};

export type DateRangePickerProps = {
  candidateRange: DateRange;
  onChangeStartDate: (newValue: DateNullable) => void;
  onChangeEndDate: (newValue: DateNullable) => void;
  //
  open: boolean;
  error: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  onReset: VoidFunction;
  onConfirm?: (candidateRange: DateRange) => void;
  //
  title?: string;
  variant?: 'calendar' | 'input';
  label: string;
  hasUnsavedChange: boolean;
};
