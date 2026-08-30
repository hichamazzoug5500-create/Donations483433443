import React from 'react';
import { AlertTriangle, HelpCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6 animate-in zoom-in-95 duration-150">
        
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            isDestructive ? 'bg-red-100 text-red-600 ring-4 ring-red-50' : 'bg-emerald-100 text-emerald-800 ring-4 ring-emerald-50'
          }`}>
            {isDestructive ? <AlertTriangle className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
          </div>

          <div className="space-y-1 flex-grow">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{message}</p>
          </div>

          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs min-h-[42px] transition-colors"
          >
            {cancelLabel || t('cancelBtn')}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 font-bold rounded-xl text-xs text-white shadow-md transition-all active:scale-95 min-h-[42px] flex items-center gap-1.5 ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-emerald-800 hover:bg-emerald-900'
            }`}
          >
            {isLoading ? '...' : (confirmLabel || t('confirmBtn'))}
          </button>
        </div>

      </div>
    </div>
  );
};
