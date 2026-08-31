import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Compass,
  PhoneCall,
  HeartHandshake
} from 'lucide-react';

export default function LandingPage() {
  const { currentUser } = useAuth();
  const { isRtl } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 text-center space-y-8 animate-in fade-in">
      
      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-emerald-700" />
        <span>{isRtl ? 'المنظومة الوطنية لتنسيق الإغاثة بين الجمعيات 🇩🇿' : 'National Relief Coordination Network 🇩🇿'}</span>
      </div>

      {/* Main Pitch */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {isRtl ? 'تنسيق فوري للمساعدات الإنسانية بين فروع الجمعيات والهلال الأحمر' : 'Instant Inter-Branch Aid Logistics & Relief Coordination'}
        </h1>
        <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
          {isRtl 
            ? 'تتيح المنصة للفروع الميدانية نشر احتياجاتها الدقيقة، وتتيح للفروع الأخرى الاطلاع عليها والالتزام بتقديم المساعدات والتنسيق الهاتفي المباشر.' 
            : 'Enabling branches in crisis areas to broadcast urgent needs, while partner branches fulfill supplies with direct telephone coordination.'}
        </p>
      </div>

      {/* 3 Simple Action Points */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-right rtl:text-right ltr:text-left pt-2">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">1</div>
          <h3 className="text-xs font-bold text-slate-900">{isRtl ? 'نشر الاحتياج الميداني' : '1. Post Field Need'}</h3>
          <p className="text-[11px] text-slate-500">{isRtl ? 'المواد المطلوبة، الكمية، ورقم هاتف المنسق.' : 'Log supplies needed and phone.'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-2xs space-y-1.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">2</div>
          <h3 className="text-xs font-bold text-emerald-950">{isRtl ? 'التكفل بالمعونة' : '2. Other Branch Commits'}</h3>
          <p className="text-[11px] text-emerald-900">{isRtl ? 'التزام الفروع المجاورة بتوفير الكميات.' : 'Partner branches commit supplies.'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">3</div>
          <h3 className="text-xs font-bold text-slate-900">{isRtl ? 'تواصل وتسليم مباشر' : '3. Phone Call & Delivery'}</h3>
          <p className="text-[11px] text-slate-500">{isRtl ? 'مكالمة هاتفية فورية لتنسيق نقل الشحنة.' : 'Direct phone sync and handover.'}</p>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => navigate('/login')}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
        >
          <span>{isRtl ? 'تسجيل الدخول للمنظومة' : 'Sign In to Network'}</span>
          <ArrowIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate('/map')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
        >
          <Compass className="w-4 h-4 text-emerald-700" />
          <span>{isRtl ? 'الخريطة الميدانية' : 'Field Map'}</span>
        </button>
      </div>

    </div>
  );
}

export { LandingPage };
