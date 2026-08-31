import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertTriangle, Building2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import MapView from '../components/MapView';

export default function FullMapPage() {
  const navigate = useNavigate();
  const { needs, branches, dispatches } = useData();
  const { isRtl } = useLanguage();

  const disasterBranchesCount = branches.filter(b => b.status === 'disaster_zone').length;
  const activeNeedsCount = needs.filter(n => n.status !== 'fulfilled').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 mb-1 font-bold"
          >
            {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isRtl ? 'العودة للوحة القيادة' : 'Back to Dashboard'}</span>
          </button>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {isRtl ? 'الخريطة الميدانية الوطنية للاستجابة والطوارئ' : 'National Emergency Response Map'}
          </h1>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>{disasterBranchesCount} {isRtl ? 'مناطق طوارئ' : 'Disaster Zones'}</span>
          </span>

          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
            {activeNeedsCount} {isRtl ? 'نداءات إغاثة نشطة' : 'Active Needs'}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm h-[75vh]">
        <MapView
          needs={needs}
          branches={branches}
          dispatches={dispatches}
          onSelectNeed={(needId) => navigate(`/needs/${needId}`)}
          zoomLevel={7}
        />
      </div>
    </div>
  );
}
