import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onCancelRef.current?.();
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-black/50"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-md w-full p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="text-lg text-gray-900 mb-2">
          {title}
        </h2>
        {message ? <p className="text-sm text-gray-600 mb-6">{message}</p> : null}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition duration-200 ${focusRing}`}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800 transition duration-200 ${focusRing}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
