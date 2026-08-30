import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpingHand, 
  Gift, 
  Utensils, 
  Shirt, 
  Stethoscope, 
  Home, 
  Package,
  HeartHandshake,
  Sparkles,
  MapPin,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LandingPage = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Background glow */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-teal-300 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-400 blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-700/60 border border-teal-500/30 text-teal-200 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
            {t('heroTitle')}
          </h1>

          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Dual Action Hero Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup?role=recipient"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base px-8 py-4 rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <HelpingHand className="w-5 h-5" />
              <span>{t('iNeedHelpCTA')}</span>
            </Link>

            <Link
              to="/signup?role=donor"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-base px-8 py-4 rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Gift className="w-5 h-5" />
              <span>{t('iWantToHelpCTA')}</span>
            </Link>
          </div>

          <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <span>{t('logIn')}?</span>
            <Link to="/login" className="text-teal-300 font-semibold underline hover:text-white">
              {t('logIn')}
            </Link>
          </p>
        </div>
      </section>

      {/* How it works (Clean Human Flow) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-teal-600 font-bold text-xs uppercase tracking-widest">{t('brandSubtitle')}</span>
          <h2 className="text-3xl font-bold text-slate-900">{t('howItWorksTitle')}</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            {t('howItWorksSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('step1Title')}</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              {t('step1Desc')}
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('step2Title')}</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              {t('step2Desc')}
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('step3Title')}</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              {t('step3Desc')}
            </p>
          </div>

        </div>
      </section>

      {/* Aid Categories Supported */}
      <section className="bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">{t('supportedCategories')}</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg inline-block">
                <Utensils className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-xs">{t('catFood')}</h4>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg inline-block">
                <Shirt className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-xs">{t('catClothing')}</h4>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-lg inline-block">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-xs">{t('catMedical')}</h4>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg inline-block">
                <Home className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-xs">{t('catShelter')}</h4>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2 col-span-2 sm:col-span-1">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-lg inline-block">
                <Package className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-xs">{t('catOther')}</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Direct CTA Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-2xl p-8 text-white text-center space-y-5 shadow-xl">
          <h2 className="text-2xl font-extrabold">{t('heroTitle')}</h2>
          <div className="flex justify-center gap-4 flex-wrap pt-2">
            <Link
              to="/signup"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 py-3 rounded-xl shadow-md transition-transform hover:scale-105"
            >
              {t('registerOrg')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
