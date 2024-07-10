import React, { useCallback, useState } from 'react';
import { useNavigationObserver } from '../../hooks/use-navigation-observer';
import { ConfirmDialog } from '../custom-dialog';

export const BeforeLeave = ({
  unsavedChanges,
  customTitle,
  customActionLabel,
  customCloseLabel,
  customContent,
  resetForm,
}: {
  unsavedChanges: boolean;
  isLoading?: boolean;
  customTitle?: string;
  customActionLabel?: string;
  customCloseLabel?: string;
  customContent?: string;
  resetForm?: () => void;
}) => {
  const [shouldFireBeforeUnload, setShouldFireBeforeUnload] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const { forceRouterPush } = useNavigationObserver({
    shouldPreventNavigation: unsavedChanges,
    shouldFireBeforeUnload,
    onNavigate: useCallback(
      (next: string, wasStopped: boolean) => {
        setPendingRoute(next);
        if (wasStopped) setIsOpen(true);
      },
      [setPendingRoute, setIsOpen],
    ),
  });

  const handleModalClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleDontSaveAndContinueAction = useCallback(async () => {
    setShouldFireBeforeUnload(false);
    resetForm?.();
    let error;
    try {
      if (pendingRoute) await forceRouterPush(pendingRoute);
    } catch (e) {
      error = e;
    } finally {
      handleModalClose();
    }
    throw error;
  }, [
    handleModalClose,
    forceRouterPush,
    pendingRoute,
    resetForm,
    setShouldFireBeforeUnload,
  ]);

  return (
    <section>
      <ConfirmDialog
        open={isOpen}
        onClose={handleModalClose}
        title={customTitle || 'You have unsaved changes'}
        content={
          customContent ||
          'Would you like to discard your changes and continue anyway?'
        }
        handleAction={handleDontSaveAndContinueAction}
        customActionLabel={customActionLabel || 'Discard Changes'}
        customCloseLabel={customCloseLabel || 'Cancel'}
        actionButtonColor={'error'}
      />
    </section>
  );
};
