import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Dialog behaviour from the style guide: focus moves into the dialog and stays
 * inside while it is open, Esc closes it, and focus returns to the button that
 * opened it. Put the returned ref on the dialog element.
 */
export function useDialogFocus<T extends HTMLElement>(isOpen: boolean, onClose: () => void) {
  const dialogRef = useRef<T>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const opener = document.activeElement as HTMLElement | null;
    const focusableItems = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => el.getClientRects().length > 0
      );

    focusableItems()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusableItems();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const isInside = !!active && !!dialogRef.current?.contains(active);

      if (event.shiftKey && (active === first || !isInside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !isInside)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (opener?.isConnected) opener.focus();
    };
  }, [isOpen]);

  return dialogRef;
}
