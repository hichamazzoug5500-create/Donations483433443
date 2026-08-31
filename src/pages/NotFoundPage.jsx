import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function NotFoundPage() {
  const { isRtl } = useLanguage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          {isRtl ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h2>
        <p className="text-slate-500 text-xs leading-relaxed">
          {isRtl ? 'الصفحة التي طلبتها غير متوفرة أو تم نقلها.' : 'The requested page is unavailable or has been moved.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow transition-all"
        >
          <Home className="w-4 h-4" />
          <span>{isRtl ? 'العودة للرئيسية' : 'Return Home'}</span>
        </Link>
      </div>
    </div>
  );
}

export { NotFoundPage };
