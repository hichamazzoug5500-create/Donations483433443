import React from 'react';
import { HeartHandshake, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span>{t('brandName')}</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              {t('footerDesc')}
            </p>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('verifiedNetwork')}</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">{t('categoriesHeader')}</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-teal-400 transition-colors">{t('catFood')}</span></li>
              <li><span className="hover:text-teal-400 transition-colors">{t('catClothing')}</span></li>
              <li><span className="hover:text-teal-400 transition-colors">{t('catMedical')}</span></li>
              <li><span className="hover:text-teal-400 transition-colors">{t('catShelter')}</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">{t('platformHeader')}</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-teal-400 transition-colors">{t('roleRecipient')}</span></li>
              <li><span className="hover:text-teal-400 transition-colors">{t('roleDonor')}</span></li>
              <li><span className="hover:text-teal-400 transition-colors">Firebase Cloud Firestore</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t('copyright')}</p>
          <p className="flex items-center gap-1">
            <span>{t('madeWithLove')}</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
