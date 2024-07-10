import { Theme, SxProps } from '@mui/material/styles';
import { DropzoneOptions, ErrorCode } from 'react-dropzone';
import { fData } from '../../utils/format-number';

// ----------------------------------------------------------------------

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  sx?: SxProps<Theme>;
  thumbnail?: boolean;
  placeholder?: React.ReactNode;
  helperText?: React.ReactNode;
  disableMultiple?: boolean;
  //
  file?: CustomFile | string | null;
  onDelete?: VoidFunction;
  //
  files?: (File | string)[];
  onUpload?: VoidFunction;
  onRemove?: (file: CustomFile | string) => void;
  onRemoveAll?: VoidFunction;
}

export const getErrorMessages = (
  acceptedFormats: string[],
  limit?: number,
  sizeLimit?: number,
): Record<string, string> => ({
  [ErrorCode.FileTooLarge]: sizeLimit
    ? `File is too large. Maximum size is ${fData(sizeLimit)}.`
    : 'File is too large.',
  [ErrorCode.FileInvalidType]: `Unsupported file. Accepted formats are ${acceptedFormats.join(', ')}.`,
  [ErrorCode.TooManyFiles]: limit
    ? `Too many files. You can upload up to ${limit} file(s).`
    : 'Too many files.',
  [ErrorCode.FileTooSmall]: 'File is too small.',
});
