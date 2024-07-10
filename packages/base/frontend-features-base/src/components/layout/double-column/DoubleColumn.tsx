import {
  DoubleColumnChildrenLayout,
  DoubleColumnIllustration,
} from './components';

export interface DoubleColumnProps {
  title?: string;
  children: React.ReactNode;
}

export function DoubleColumn({ title, children }: DoubleColumnProps) {
  const pageTitle = title ?? 'Manage the job more efeciently with Minimal';

  return (
    <>
      <DoubleColumnIllustration title={pageTitle} />
      <DoubleColumnChildrenLayout>{children}</DoubleColumnChildrenLayout>
    </>
  );
}
