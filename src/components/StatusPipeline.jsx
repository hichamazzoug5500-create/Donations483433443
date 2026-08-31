import React from 'react';
import { Check, Clock, Truck, Package, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PIPELINE_STAGES = [
  { id: 'pledged', labelAr: 'تم الالتزام', labelEn: 'Pledged', icon: Clock },
  { id: 'packing', labelAr: 'قيد التجهيز', labelEn: 'Packing', icon: Package },
  { id: 'dispatched', labelAr: 'انطلقت القافلة', labelEn: 'Dispatched', icon: Truck },
  { id: 'in_transit', labelAr: 'في الطريق', labelEn: 'In Transit', icon: Truck },
  { id: 'delivered', labelAr: 'وصلت للموقع', labelEn: 'Delivered', icon: CheckCircle2 },
  { id: 'confirmed', labelAr: 'تم استلام وتفريغ المعونة', labelEn: 'Confirmed & Stored', icon: ShieldCheck }
];

export default function StatusPipeline({ currentStatus = 'pledged', onUpdateStatus = null, isOwner = false }) {
  const { isRtl } = useLanguage();

  const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === currentStatus);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="w-full py-4 px-2">
      <div className="flex items-center justify-between relative">
        {/* Background Track Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-emerald-700 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(safeIndex / (PIPELINE_STAGES.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {PIPELINE_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isCompleted = idx < safeIndex;
          const isCurrent = idx === safeIndex;
          const isPending = idx > safeIndex;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center group">
              <button
                type="button"
                disabled={!onUpdateStatus || !isOwner}
                onClick={() => onUpdateStatus && onUpdateStatus(stage.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  isCompleted 
                    ? 'bg-emerald-800 text-white' 
                    : isCurrent 
                    ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 scale-110' 
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                } ${onUpdateStatus && isOwner ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </button>

              <span className={`mt-2 text-[10px] sm:text-xs font-bold text-center whitespace-nowrap transition-colors ${
                isCurrent 
                  ? 'text-emerald-900 font-black' 
                  : isCompleted 
                  ? 'text-slate-700' 
                  : 'text-slate-400'
              }`}>
                {isRtl ? stage.labelAr : stage.labelEn}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { StatusPipeline };
