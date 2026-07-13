import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Heart, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'success', title, message, actionLabel, actionTo }) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, title, message, actionLabel, actionTo }]);
      window.setTimeout(() => dismissToast(id), 4200);
      return id;
    },
    [dismissToast]
  );

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-100 flex flex-col gap-3 w-[calc(100%-2rem)] max-w-sm pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="pointer-events-auto bg-white border border-gray-200 shadow-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {toast.type === 'favorite' ? (
                    <Heart className="w-5 h-5 fill-gray-900 text-gray-900" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-gray-900" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {toast.title && (
                    <p className="text-sm text-gray-900 mb-0.5">{toast.title}</p>
                  )}
                  {toast.message && (
                    <p className="text-sm text-gray-600">{toast.message}</p>
                  )}
                  {toast.actionLabel && toast.actionTo && (
                    <Link
                      to={toast.actionTo}
                      className="inline-block mt-2 text-sm text-gray-900 underline underline-offset-2 hover:no-underline"
                      onClick={() => dismissToast(toast.id)}
                    >
                      {toast.actionLabel}
                    </Link>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="p-1 text-gray-400 hover:text-gray-900 transition"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
