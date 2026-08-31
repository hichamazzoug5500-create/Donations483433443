import React from 'react';
import { ShieldCheck, Heart, Building2, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { isRtl, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 py-8 pb-20 md:pb-8 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xs font-black">
                {isRtl ? 'إغاثة' : 'RC'}
              </div>
              <span>{isRtl ? 'منصة تنسيق الإغاثة بين الجمعيات' : 'Relief Coordination Platform'}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {isRtl 
                ? 'منظومة رقمية للتنسيق اللوجستي الفوري بين فروع الهلال الأحمر والجمعيات الخيرية الإنسانية في الجزائر أثناء الأزمات والكوارث الطبيعية.' 
                : 'Digital operational platform for inter-branch logistics and disaster response across Algerian humanitarian charities.'}
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isRtl ? 'شبكة مغلقة ومحمية للجمعيات المعتمدة' : 'Authorized Humanitarian Network'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{isRtl ? 'مجالات الاستجابة' : 'Response Clusters'}</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• {isRtl ? 'الطرود الغذائية والمياه' : 'Food & WASH'}</li>
              <li>• {isRtl ? 'الإيواء والخيام والأغطية' : 'Emergency Shelter'}</li>
              <li>• {isRtl ? 'الإسعافات والمستلزمات الطبية' : 'Medical First-Aid'}</li>
              <li>• {isRtl ? 'إدارة القوافل الميدانية' : 'Convoy Management'}</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{isRtl ? 'التغطية الوطنية' : 'National Footprint'}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isRtl 
                ? 'تغطية متكاملة لـ 58 ولاية جزائرية مع ربط مباشر بين المستودعات المركزية ومراكز الطوارئ الميدانية.' 
                : 'Full coverage across Algerian wilayas connecting central supply hubs with frontline disaster branches.'}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} {isRtl ? 'منصة تنسيق الإغاثة — شبكة التكافل الإنساني' : 'Relief Coordination Platform'}</div>
          <div className="flex items-center gap-1">
            <span>{isRtl ? 'لخدمة الوطن والعمل الإنساني في الجزائر' : 'Humanitarian Solidarity in Algeria'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
