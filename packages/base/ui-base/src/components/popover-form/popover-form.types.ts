import { ReactNode } from 'react';
import { FormState, FieldValues } from 'react-hook-form';
import * as z from 'zod';
import { FormRef } from '../../hooks/use-form-ref';

export type PopoverFormProps<T extends FieldValues> = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: T) => unknown;
  defaultValues?: T;
  formSchema: z.Schema<T>;
  title: string;
  closeText: string;
  submitText: string;
  children: (formState: FormState<T>) => ReactNode;
  formRef?: FormRef<T>;
};
