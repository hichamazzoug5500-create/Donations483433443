import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { isRtl } = useLanguage();

  return (
    <footer className="py-6 pb-20 md:pb-6 text-center text-xs text-slate-400 border-t border-slate-200 mt-auto">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="font-semibold text-slate-600">
          {isRtl ? 'منظومة تنسيق الإغاثة بين الجمعيات 🇩🇿' : 'Inter-Branch Relief Coordination 🇩🇿'}
        </p>
        <p className="text-[11px] text-slate-400">
          {isRtl ? 'الهلال الأحمر والجمعيات الإنسانية المعتمدة' : 'Algerian Red Crescent & Authorized NGOs'}
        </p>
      </div>
    </footer>
  );
}

export { Footer };
