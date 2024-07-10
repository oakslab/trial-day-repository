import { Ref, useRef } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

export type FormRef<T extends FieldValues> = Ref<{
  form: ReturnType<typeof useForm<T>>;
}>;

export const useFormRef = <T extends FieldValues>() => {
  return useRef<{ form: ReturnType<typeof useForm<T>> }>(null);
};
