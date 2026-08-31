import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import MapView from '../components/MapView';

export default function FullMapPage() {
  const navigate = useNavigate();
  const { userProfile, isSuperAdmin } = useAuth();
  const { needs, branches, dispatches } = useData();
  const { isRtl } = useLanguage();

  // Strict charity isolation on map
  const scopedNeeds = useMemo(() => {
    if (isSuperAdmin) return needs;
    return needs.filter(n => !userProfile?.orgId || n.orgId === userProfile.orgId);
  }, [needs, isSuperAdmin, userProfile?.orgId]);

  const scopedBranches = useMemo(() => {
    if (isSuperAdmin) return branches;
    return branches.filter(b => !userProfile?.orgId || b.orgId === userProfile.orgId);
  }, [branches, isSuperAdmin, userProfile?.orgId]);

  const activeNeedsCount = scopedNeeds.filter(n => n.status === 'open' || n.status === 'in_progress').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-800 mb-1 font-bold"
          >
            {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isRtl ? 'العودة للوحة القيادة' : 'Back to Dashboard'}</span>
          </button>
          <h1 className="text-2xl font-black text-slate-900">
            {isRtl ? 'الخريطة الميدانية — ' : 'Field Map — '}
            {isSuperAdmin ? (isRtl ? 'جميع الجمعيات' : 'All Charities') : (userProfile?.orgName || 'الجمعية')}
          </h1>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold">
            {activeNeedsCount} {isRtl ? 'طلبات مساعدة تابعة لجمعيتكم' : 'Active Needs in Your Charity'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm h-[75vh]">
        <MapView
          needs={scopedNeeds}
          branches={scopedBranches}
          dispatches={dispatches}
          onSelectNeed={(needId) => navigate(`/dashboard`)}
          zoomLevel={7}
        />
      </div>
    </div>
  );
}

export { FullMapPage };
