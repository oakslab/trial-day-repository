import { UseFormReturn, FormProvider as Form } from 'react-hook-form';

// ----------------------------------------------------------------------
type FieldValues = Record<string, unknown>;

type Props<TFieldValues extends FieldValues = FieldValues> = {
  children: React.ReactNode;
  methods: UseFormReturn<TFieldValues>;
  onSubmit?: VoidFunction;
};

export default function FormProvider<
  TFieldValues extends FieldValues = FieldValues,
>({ children, onSubmit, methods }: Props<TFieldValues>) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
