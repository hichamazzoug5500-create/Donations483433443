import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    const newToast = { id, type, title, message, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const showSuccess = useCallback((message, title = '') => {
    return addToast({ type: 'success', title, message });
  }, [addToast]);

  const showError = useCallback((message, title = '') => {
    return addToast({ type: 'error', title, message, duration: 6000 });
  }, [addToast]);

  const showWarning = useCallback((message, title = '') => {
    return addToast({ type: 'warning', title, message });
  }, [addToast]);

  const showInfo = useCallback((message, title = '') => {
    return addToast({ type: 'info', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-sm z-[100] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl shadow-xl border p-4 flex items-start gap-3 transition-all transform animate-in slide-in-from-top-3 duration-200 ${
              toast.type === 'success'
                ? 'bg-emerald-900/95 text-white border-emerald-700/80 backdrop-blur-md'
                : toast.type === 'error'
                ? 'bg-red-900/95 text-white border-red-700/80 backdrop-blur-md'
                : toast.type === 'warning'
                ? 'bg-amber-900/95 text-white border-amber-700/80 backdrop-blur-md'
                : 'bg-slate-900/95 text-white border-slate-700/80 backdrop-blur-md'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-300" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-300" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-teal-300" />}
            </div>

            <div className="flex-grow text-xs leading-relaxed">
              {toast.title && <div className="font-bold text-sm mb-0.5">{toast.title}</div>}
              <div className="font-medium text-slate-100">{toast.message}</div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
