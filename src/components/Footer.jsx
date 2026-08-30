import React from 'react';
import { HeartHandshake, ShieldCheck, Heart } from 'lucide-react';
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
              <span>منصة أمل الجزائر</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              منصة غير ربحية ومباشرة لربط الجمعيات الخيرية والمبادرات الإنسانية في الجزائر مع المتبرعين والمحسنين.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>شبكة العمل الخيري والتكافل الإنساني بالجزائر 🇩🇿</span>
            </div>
          </div>

          <div className="hidden sm:block">
            <h4 className="text-white font-semibold text-xs mb-2">فئات المساعدات</h4>
            <ul className="space-y-1.5 text-xs">
              <li><span>مواد غذائية ومؤونة</span></li>
              <li><span>ألبسة وأغطية</span></li>
              <li><span>مستلزمات طبية وأدوية</span></li>
              <li><span>مأوى وسكن مؤقت</span></li>
            </ul>
          </div>

          <div className="hidden sm:block">
            <h4 className="text-white font-semibold text-xs mb-2">عن المنصة</h4>
            <ul className="space-y-1.5 text-xs">
              <li><span>جمعيات ومنظمات معتمدة</span></li>
              <li><span>متبرعون ومحسنون</span></li>
              <li><span>تنسيق وتوصيل مباشر</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© جميع الحقوق محفوظة لمنصة أمل الجزائر للتكافل الخيري.</p>
          <p className="flex items-center gap-1">
            <span>صنع لدعم العمل الخيري بالجزائر</span>
            <Heart className="w-3 h-3 text-red-500 fill-current inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
