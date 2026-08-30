import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NotFoundPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
        <h2 className="text-xl font-bold text-slate-800">{t('pageNotFound')}</h2>
        <p className="text-slate-500 text-xs leading-relaxed">
          {t('pageNotFoundDesc')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow transition-all"
        >
          <Home className="w-4 h-4" />
          <span>{t('returnHome')}</span>
        </Link>
      </div>
    </div>
  );
};
