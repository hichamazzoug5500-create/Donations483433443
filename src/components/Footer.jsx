import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 py-8 pb-safe-nav md:pb-8 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center text-white text-xs font-bold">
                أمل
              </div>
              <span>{t('brandName')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {t('footerDescription')}
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('footerNetworkBadge')}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('footerAidCategories')}</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• {t('catFood')}</li>
              <li>• {t('catClothing')}</li>
              <li>• {t('catMedical')}</li>
              <li>• {t('catShelter')}</li>
              <li>• {t('catOther')}</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('footerPlatformLinks')}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footerHandcrafted')}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-500">
          <div>{t('footerCopyright')}</div>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for Algeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
