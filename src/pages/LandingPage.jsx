import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Building2,
  HeartHandshake,
  ShieldCheck,
  Package,
  Utensils,
  Shirt,
  Stethoscope,
  Home,
  ArrowRight,
  ArrowLeft,
  Lock,
  CheckCircle2,
  PlusCircle,
  Search,
  Sparkles
} from 'lucide-react';

export const LandingPage = () => {
  const { currentUser, role: userRole } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleCharityAction = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/signup?role=recipient');
    }
  };

  const handleDonorAction = () => {
    if (currentUser) {
      navigate('/donor');
    } else {
      navigate('/signup?role=donor');
    }
  };

  const CATEGORIES = [
    { key: 'catFood', icon: Utensils, color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
    { key: 'catClothing', icon: Shirt, color: 'bg-blue-50 text-blue-900 border-blue-200' },
    { key: 'catMedical', icon: Stethoscope, color: 'bg-rose-50 text-rose-900 border-rose-200' },
    { key: 'catShelter', icon: Home, color: 'bg-amber-50 text-amber-900 border-amber-200' },
    { key: 'catOther', icon: Package, color: 'bg-purple-50 text-purple-900 border-purple-200' }
  ];

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6 sm:space-y-10 pb-safe-nav md:pb-16">
      
      {/* 🌟 1. HERO SECTION & PLATFORM PURPOSE 🌟 */}
      <section className="bg-slate-900 text-white pt-6 sm:pt-14 pb-8 sm:pb-18 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-5xl mx-auto text-center space-y-3 sm:space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/90 text-emerald-300 border border-emerald-700/60 text-[10px] sm:text-xs font-bold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="text-xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-snug sm:leading-tight">
            {t('heroTitle')}
            <span className="block text-emerald-400 mt-1 sm:mt-2 text-lg sm:text-3xl md:text-4xl font-bold">
              {t('heroTitleSub')}
            </span>
          </h1>

          <p className="text-slate-300 text-[11px] sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* 🌟 2. TWO DISTINCT INTERACTIVE WORKFLOW PATHS 🌟 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto pt-3 sm:pt-4 text-right rtl:text-right ltr:text-left">
            
            {/* Path 1: Recipient / Charity Path */}
            <div className="bg-slate-800/90 border-2 border-emerald-500/40 hover:border-emerald-400 p-4 sm:p-5 rounded-2xl shadow-lg transition-all space-y-2 sm:space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-700/80 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {t('iAmCharity')}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('charityPathDesc')}
                </p>
              </div>

              <button
                onClick={handleCharityAction}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('publishNeedsCTA')}</span>
              </button>
            </div>

            {/* Path 2: Donor / Contributor Path */}
            <div className="bg-slate-800/90 border-2 border-amber-500/40 hover:border-amber-400 p-4 sm:p-5 rounded-2xl shadow-lg transition-all space-y-2 sm:space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-600/80 text-white flex items-center justify-center font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {t('iAmDonor')}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('donorPathDesc')}
                </p>
              </div>

              <button
                onClick={handleDonorAction}
                className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Search className="w-4 h-4" />
                <span>{t('browseAndPledgeCTA')}</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 🌟 3. HOW IT WORKS (كيف تعمل المنصة في 3 خطوات) 🌟 */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xs space-y-4 sm:space-y-6">
          
          <div className="text-center space-y-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              {t('howItWorksBadge')}
            </span>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900">
              {t('howItWorksTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 pt-1 sm:pt-2">
            
            {/* Step 1 */}
            <div className="bg-slate-50 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">{t('step1Title')}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('step1Desc')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-emerald-50/70 p-3.5 sm:p-5 rounded-2xl border border-emerald-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-extrabold text-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-emerald-950">{t('step2Title')}</h4>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {t('step2Desc')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900">{t('step3Title')}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 🌟 4. SUPPORTED CATEGORIES 🌟 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 text-center">
            {t('categoriesTitle')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-4">
            {CATEGORIES.map(({ key, icon: Icon, color }) => (
              <div
                key={key}
                className={`p-3 sm:p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all ${color}`}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="text-xs font-bold">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌟 5. DONOR PORTAL ACCESS & CALL TO ACTION 🌟 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-slate-700 shadow-lg space-y-6">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t('donorPortalCardTitle')}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold">
              {t('donorPortalCardTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('donorPortalCardDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto text-right rtl:text-right ltr:text-left">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-200">{t('donorPortalBenefit1')}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-200">{t('donorPortalBenefit2')}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-200">{t('donorPortalBenefit3')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleDonorAction}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm py-3.5 px-7 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[46px]"
            >
              <span>{t('loginToViewNeeds')}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <button
              onClick={handleCharityAction}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 min-h-[46px]"
            >
              <span>{t('registerAsCharityCTA')}</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
