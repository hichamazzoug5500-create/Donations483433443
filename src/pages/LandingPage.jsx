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
  Compass,
  Package,
  HeartHandshake
} from 'lucide-react';

export default function LandingPage() {
  const { currentUser } = useAuth();
  const { isRtl } = useLanguage();
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
    <div className="space-y-10 pb-16">
      
      {/* Hero Command Banner */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-16 px-4 sm:px-6 lg:px-8 text-slate-900 text-center">
        <div className="max-w-4xl mx-auto space-y-5">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{isRtl ? 'المنظومة الوطنية لتنسيق الإغاثة بين الجمعيات 🇩🇿' : 'National Disaster Relief Coordination Network 🇩🇿'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
            {isRtl ? 'تنسيق لوجستي فوري بين فروع الجمعيات والهلال الأحمر' : 'Instant Inter-Branch Disaster Coordination'}
            <span className="block text-emerald-800 mt-2 text-xl sm:text-3xl md:text-4xl font-extrabold">
              {isRtl ? 'لتلبية الاحتياجات ونقل المعونات يداً بيد' : 'Connecting Branches Directly'}
            </span>
          </h1>

          <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            {isRtl 
              ? 'تتيح المنصة للفروع الميدانية نشر احتياجاتها الدقيقة، وتتيح للفروع الأخرى الاطلاع عليها والالتزام بتقديم المساعدات والتنسيق الهاتفي المباشر.' 
              : 'Empowering disaster-zone branches to broadcast verified needs, while partner branches commit aid with direct phone coordination.'}
          </p>

          {/* Action CTA */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={handleEnterPlatform}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>{currentUser ? (isRtl ? 'الدخول للوحة القيادة' : 'Go to Dashboard') : (isRtl ? 'تسجيل الدخول للمنظومة' : 'Sign In to Platform')}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/map')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>{isRtl ? 'استعراض الخريطة الوطنية' : 'View National Map'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3 Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            {isRtl ? 'آلية العمل والتنسيق' : 'Workflow'}
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900">
            {isRtl ? 'كيف يتم تنسيق المساعدات بين الفروع؟' : 'How Branches Coordinate in 3 Steps'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-sm border border-emerald-100">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {isRtl ? '1. الفرع ينشر طلب المساعدة' : '1. Branch Posts Aid Need'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isRtl 
                ? 'ينشر الفرع في منطقة الحاجة تفاصيل المواد المطلوبة والكمية ورقم هاتف المسؤول وموقع الاستلام على الخريطة.' 
                : 'Branch logs precise supplies needed with location pin and coordinator phone.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-emerald-950">
              {isRtl ? '2. الفرع الآخر يلتزم بالمساعدة' : '2. Other Branch Commits'}
            </h3>
            <p className="text-xs text-emerald-900 leading-relaxed">
              {isRtl 
                ? 'يتصفح منسقو الفروع الأخرى النداءات الحية، ويلتزمون بتوفير الكميات المتاحة لديهم (تكفل كامل أو جزئي).' 
                : 'Neighboring branches review open needs and commit to fulfill full or partial amounts.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-sm border border-emerald-100">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {isRtl ? '3. التواصل الهاتفي والتسليم' : '3. Phone Call & Handover'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isRtl 
                ? 'يتواصل الطرفان هاتفياً لتنسيق نقل المساعدات والتسليم يداً بيد على أرض الواقع بكل شفافية.' 
                : 'Direct phone coordination for drop-off time and transparent physical handover.'}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

export { LandingPage };
