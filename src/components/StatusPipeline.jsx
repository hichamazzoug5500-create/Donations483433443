import React from 'react';
import { Check, Clock, Truck, Package, ShieldCheck, CheckCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function StatusPipeline({ currentStatus, onAdvanceStatus = null, canAdvance = false }) {
  const { isRtl } = useLanguage();

  const stages = [
    { key: 'pledged', label: isRtl ? 'تم الالتزام' : 'Pledged', icon: Clock },
    { key: 'packing', label: isRtl ? 'قيد التجهيز' : 'Packing', icon: Package },
    { key: 'dispatched', label: isRtl ? 'انطلاق القافلة' : 'Dispatched', icon: Truck },
    { key: 'in_transit', label: isRtl ? 'في الطريق' : 'In Transit', icon: Truck },
    { key: 'delivered', label: isRtl ? 'وصلت للموقع' : 'Delivered', icon: Check },
    { key: 'confirmed', label: isRtl ? 'تم الاستلام والتفريغ' : 'Confirmed', icon: CheckCheck }
  ];

  const currentIndex = stages.findIndex(s => s.key === currentStatus);
  const activeIdx = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full py-3">
      {/* Desktop / Tablet Horizontal Pipeline */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Background Connecting Track */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-4 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(activeIdx / (stages.length - 1)) * 92}%` }}
        />

        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          const isFuture = idx > activeIdx;

          return (
            <div key={stage.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                  isDone
                    ? 'bg-emerald-500 text-white ring-4 ring-white dark:ring-slate-900'
                    : isCurrent
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 scale-110'
                    : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[11px] font-bold mt-2 whitespace-nowrap text-center ${
                isCurrent 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : isDone ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
              }`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Compact Progress Bar */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-emerald-600 dark:text-emerald-400">
            {stages[activeIdx]?.label}
          </span>
          <span className="text-slate-400">
            {activeIdx + 1} / {stages.length}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((activeIdx + 1) / stages.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
