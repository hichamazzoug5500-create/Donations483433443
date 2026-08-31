import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Building2, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  AlertTriangle, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  Globe2, 
  CheckCircle,
  PackageCheck,
  Compass
} from 'lucide-react';

export default function LandingPage() {
  const { currentUser } = useAuth();
  const { isRtl, t } = useLanguage();
  const navigate = useNavigate();

  const handleEnterPlatform = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Command Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-12 pb-18 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? 'المنظومة الرقمية الوطنية لتنسيق الإغاثة في الكوارث 🇩🇿' : 'National Disaster Relief Coordination Network 🇩🇿'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {isRtl ? 'تنسيق لوجستي فوري بين فروع الجمعيات والهلال الأحمر' : 'Instant Inter-Branch Disaster Coordination'}
            <span className="block text-emerald-400 mt-2 text-2xl sm:text-4xl font-extrabold">
              {isRtl ? 'لسد الاحتياجات ونقل المعونات في مناطق الكوارث' : 'Connecting Supply Hubs with Ground Emergency Zones'}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {isRtl 
              ? 'تتيح المنصة للفروع الميدانية في المناطق المنكوبة نشر الاحتياجات الدقيقة لكل نقطة جغرافية، وتتيح للفروع الإقليمية والمركزية توجيه قوافل الإغاثة وتتبع مسارها لحظياً.' 
              : 'Empowering disaster-zone branches to broadcast verified multi-item needs, while regional hubs dispatch aid convoys with live tracking.'}
          </p>

          {/* Action CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleEnterPlatform}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2.5 transform active:scale-95"
            >
              <span>{currentUser ? (isRtl ? 'الدخول للوحة القيادة' : 'Go to Dashboard') : (isRtl ? 'تسجيل الدخول للمنظومة' : 'Sign In to Platform')}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/map')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'استعراض الخريطة الوطنية' : 'View National Map'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3 Pillars of Inter-Branch Coordination */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
            {isRtl ? 'ركائز المنظومة' : 'Core Architecture'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isRtl ? 'كيف يتم تنسيق المساعدات بين الفروع؟' : 'How Branches Coordinate in Crises'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-black">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isRtl ? '1. حصر الاحتياجات الميدانية' : '1. Rapid Needs Assessment'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isRtl 
                ? 'ينشر الفرع الموجود في منطقة الكارثة طلبات محددة (طرود، مياه، أدوية، خيام) مع تحديد الموقع الجغرافي وحالة الطرق والأولوية P1-P4.' 
                : 'Frontline branches log precise multi-item requisitions with GPS tags, road access status, and standard P1-P4 urgency.'}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-black">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isRtl ? '2. استجابة الفروع وتسيير القوافل' : '2. Inter-Branch Aid Dispatch'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isRtl 
                ? 'تطلع الفروع الأخرى على النداءات وتلتزم بتوفير المواد المتاحة بمستودعاتها مع تسجيل ترقيم الشاحنات وهوية السائق وموعد الوصول.' 
                : 'Neighboring and national branches review open requisitions, commit stock, and log convoy vehicles and driver details.'}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-black">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isRtl ? '3. تتبع المسار والتفريغ بالمستودع' : '3. Convoy Tracking & Handover'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isRtl 
                ? 'تتبع خطي عبر 6 مراحل (من الالتزام حتى التفريغ والتأكيد) مع تحديث نسب استيفاء الاحتياجات تلقائياً وبشكل موثق.' 
                : '6-stage tracking pipeline from pledge to warehouse check-in, automatically updating item fulfillment metrics.'}
            </p>
          </div>
        </div>
      </section>

      {/* Security & Access Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">
                {isRtl ? 'بيئة تشغيلية آمنة ومخصصة للمنظمات الإنسانية' : 'Authorized Humanitarian Operations Environment'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {isRtl ? 'يتم التحقق من الفروع والمستخدمين مسبقاً لمنع ازدواجية المساعدات وضمان وصول القوافل لمستحقيها.' : 'Branch access and coordinator roles are strictly managed by organization leadership.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleEnterPlatform}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition shrink-0"
          >
            {isRtl ? 'تسجيل الدخول المعتمد' : 'Authorized Sign In'}
          </button>
        </div>
      </section>

    </div>
  );
}

export { LandingPage };
