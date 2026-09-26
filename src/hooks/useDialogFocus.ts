import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

interface UseDialogFocusOptions {
  isOpen: boolean;
  dialogRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

export function useDialogFocus({
  isOpen,
  dialogRef,
  onClose,
}: UseDialogFocusOptions) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter(
      (element) =>
        !element.hasAttribute('hidden') &&
        element.getAttribute('aria-hidden') !== 'true',
    );

    (focusable[0] ?? dialog).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const dialogOwnsFocus =
        activeElement === dialog ||
        (activeElement instanceof Node && dialog.contains(activeElement));

      // Only the dialog that currently owns keyboard focus should handle
      // Escape/Tab. This is more reliable than DOM order when animated
      // dialogs briefly overlap during exit transitions.
      if (!dialogOwnsFocus) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;

      const currentFocusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter(
        (element) =>
          !element.hasAttribute('hidden') &&
          element.getAttribute('aria-hidden') !== 'true',
      );

      if (currentFocusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = currentFocusable[0];
      const last = currentFocusable[currentFocusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [dialogRef, isOpen]);
}
