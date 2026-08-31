import React from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Package, 
  Truck, 
  Phone, 
  Users, 
  Clock, 
  Globe2, 
  ShieldCheck, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function NeedCard({ need, onSelect, onOpenDispatch }) {
  const { isRtl } = useLanguage();
  const { userProfile } = useAuth();

  const isOwnBranch = need.branchId === userProfile?.branchId;
  const isSameOrg = need.orgId === userProfile?.orgId;

  // Format time ago
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return isRtl ? 'الآن' : 'Just now';
    if (diffMins < 60) return isRtl ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    if (diffHours < 24) return isRtl ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    return isRtl ? `منذ ${Math.floor(diffHours / 24)} يوم` : `${Math.floor(diffHours / 24)}d ago`;
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'P1_critical':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white flex items-center gap-1 shadow-sm">
            <span className="animate-ping w-1.5 h-1.5 rounded-full bg-white" />
            <span>P1 - {isRtl ? 'حرج (0-24س)' : 'Critical'}</span>
          </span>
        );
      case 'P2_urgent':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
            P2 - {isRtl ? 'عاجل (24-48س)' : 'Urgent'}
          </span>
        );
      case 'P3_high':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
            P3 - {isRtl ? 'أولوية مرتفعة' : 'High'}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500 text-white">
            P4 - {isRtl ? 'متوسط' : 'Medium'}
          </span>
        );
    }
  };

  const getDisasterIcon = (type) => {
    switch (type) {
      case 'flood': return '🌊 ' + (isRtl ? 'فيضانات' : 'Flood');
      case 'earthquake': return '🏚️ ' + (isRtl ? 'زلزال' : 'Earthquake');
      case 'fire': return '🔥 ' + (isRtl ? 'حرائق' : 'Fire');
      case 'drought': return '☀️ ' + (isRtl ? 'جفاف' : 'Drought');
      default: return '⚠️ ' + (isRtl ? 'طارئ إغاثي' : 'Disaster');
    }
  };

  const getAccessBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">🟢 {isRtl ? 'مسالك سالكة' : 'Roads Open'}</span>;
      case 'obstructed':
        return <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">🟡 {isRtl ? 'مسالك صعبة' : 'Obstructed'}</span>;
      case 'cut_off':
        return <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">🔴 {isRtl ? 'منطقة معزولة' : 'Cut Off'}</span>;
      default:
        return null;
    }
  };

  // Overall Fulfillment Percentage
  const totalQty = (need.items || []).reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);
  const totalFulfilled = (need.items || []).reduce((acc, it) => acc + (Number(it.quantityFulfilled) || 0), 0);
  const overallPercent = totalQty > 0 ? Math.min(100, Math.round((totalFulfilled / totalQty) * 100)) : 0;

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${
      need.priority === 'P1_critical'
        ? 'border-rose-200 dark:border-rose-900/60 shadow-rose-500/5'
        : 'border-slate-200 dark:border-slate-800 shadow-slate-900/5'
    }`}>
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {getPriorityBadge(need.priority)}
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
              {getDisasterIcon(need.disasterType)}
            </span>
            {need.isCrossOrg && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                <Globe2 className="w-3 h-3" />
                <span>{isRtl ? 'تنسيق مشترك' : 'Cross-Org'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-xs shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimeAgo(need.createdAt)}</span>
          </div>
        </div>

        {/* Title & Branch info */}
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mb-1.5 leading-snug line-clamp-2">
          {need.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{need.orgName}</span>
          <span>•</span>
          <span className="text-slate-700 dark:text-slate-300 font-medium">{need.branchName}</span>
        </div>

        {/* Location & Access Info */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 mb-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-bold truncate">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{need.location?.wilaya} — {need.location?.address}</span>
            </div>
            {getAccessBadge(need.location?.accessStatus)}
          </div>

          {need.affectedPopulation && (need.affectedPopulation.households > 0 || need.affectedPopulation.individuals > 0) && (
            <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-600" />
                <span>{need.affectedPopulation.households} {isRtl ? 'عائلة متضررة' : 'families'}</span>
              </span>
              <span>•</span>
              <span>{need.affectedPopulation.individuals} {isRtl ? 'فرد' : 'individuals'}</span>
            </div>
          )}
        </div>

        {/* Requested Items with Progress Bars */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isRtl ? 'الأصناف والمستلزمات' : 'Required Items'} ({need.items?.length || 0})</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {overallPercent}% {isRtl ? 'تم الالتزام به' : 'Fulfilled'}
            </span>
          </div>

          <div className="space-y-2">
            {need.items?.slice(0, 3).map((item, idx) => {
              const itemPercent = item.quantity > 0 
                ? Math.min(100, Math.round(((item.quantityFulfilled || 0) / item.quantity) * 100)) 
                : 0;

              return (
                <div key={item.itemId || idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[65%]">
                      {item.description}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      <strong>{item.quantityFulfilled || 0}</strong> / {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        itemPercent >= 100 
                          ? 'bg-emerald-500' 
                          : itemPercent > 0 ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      style={{ width: `${itemPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {need.items?.length > 3 && (
              <p className="text-[11px] text-slate-400 text-center pt-1 font-medium">
                +{need.items.length - 3} {isRtl ? 'أصناف إضافية مطلوبة...' : 'more items required...'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <button
          onClick={() => onSelect(need.id)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1"
        >
          <span>{isRtl ? 'عرض التفاصيل' : 'Details'}</span>
          {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Send Aid Dispatch Button (Visible for other branches or same org) */}
        {!isOwnBranch && (
          <button
            onClick={() => onOpenDispatch(need)}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-1.5 shrink-0"
          >
            <Truck className="w-4 h-4" />
            <span>{isRtl ? 'إرسال معونة' : 'Send Aid'}</span>
          </button>
        )}

        {/* Contact Phone Button */}
        {need.contactPhone && (
          <a
            href={`tel:${need.contactPhone}`}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition shrink-0"
            title={isRtl ? 'اتصال مباشر بالمنسق' : 'Call Coordinator'}
          >
            <Phone className="w-4 h-4 text-emerald-600" />
          </a>
        )}
      </div>
    </div>
  );
}
