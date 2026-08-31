import React from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Phone, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Edit3,
  Utensils,
  Shirt,
  Stethoscope,
  Home,
  Package
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function NeedCard({ 
  need, 
  onSelect, 
  onEdit, 
  onToggleStatus 
}) {
  const { isRtl } = useLanguage();
  const { userProfile } = useAuth();

  const isOwner = need.branchId === userProfile?.branchId;
  const isFulfilled = need.status === 'fulfilled';
  const isInProgress = need.status === 'in_progress' || need.remainingQuantity;

  // Category Icon Mapping
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food': return <Utensils className="w-4 h-4 text-emerald-700" />;
      case 'clothing': return <Shirt className="w-4 h-4 text-blue-700" />;
      case 'medical': return <Stethoscope className="w-4 h-4 text-rose-700" />;
      case 'shelter': return <Home className="w-4 h-4 text-amber-700" />;
      default: return <Package className="w-4 h-4 text-slate-700" />;
    }
  };

  // Urgency indicator dot
  const getUrgencyDot = (urgency = 'high') => {
    if (urgency === 'high' || urgency === 'P1_critical') {
      return <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 ring-2 ring-red-100 animate-pulse" title={isRtl ? 'حالة عاجلة' : 'Urgent'} />;
    }
    if (urgency === 'medium' || urgency === 'P2_urgent') {
      return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 ring-2 ring-amber-100" title={isRtl ? 'خلال أيام' : 'Medium'} />;
    }
    return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-100" title={isRtl ? 'مستمر' : 'Normal'} />;
  };

  // Relative Time format
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 2) return isRtl ? 'الآن' : 'Just now';
    if (diffMins < 60) return isRtl ? `منذ ${diffMins} د` : `${diffMins}m ago`;
    if (diffHours < 24) return isRtl ? `منذ ${diffHours} س` : `${diffHours}h ago`;
    return isRtl ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
  };

  const title = need.needDescription || need.title || (need.items && need.items[0]?.description) || '';
  const quantity = need.quantity || (need.items && need.items[0]?.quantity ? `${need.items[0].quantity} ${need.items[0].unit || ''}` : '');
  const locationText = need.location?.city || need.location?.wilaya || 'الجزائر';
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div 
      onClick={() => onSelect(need)}
      className={`group relative bg-white rounded-2xl border p-4 transition-all duration-150 cursor-pointer select-none hover:shadow-sm hover:border-emerald-700 active:scale-[0.99] ${
        isFulfilled 
          ? 'border-slate-200 bg-slate-50/60 opacity-60' 
          : isInProgress
          ? 'border-amber-300/80 bg-amber-50/15'
          : 'border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Urgency & Category Icon */}
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition">
          {getCategoryIcon(need.category)}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Top Line: Urgency dot + Title + Time */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {getUrgencyDot(need.urgency)}
              <h3 className="text-sm font-bold text-slate-900 truncate leading-snug">
                {title}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(need.createdAt)}
            </span>
          </div>

          {/* Subtitle: Branch · Wilaya · Quantity */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-800" />
              <span className="truncate max-w-[140px]">{need.branchName || need.orgName}</span>
            </span>

            <span>•</span>

            <span className="flex items-center gap-0.5 text-slate-600">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{locationText}</span>
            </span>

            {quantity && (
              <>
                <span>•</span>
                <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                  {quantity}
                </span>
              </>
            )}

            {isInProgress && !isFulfilled && (
              <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md text-[10px]">
                {isRtl ? 'قيد التكفل' : 'In Progress'}
              </span>
            )}

            {isFulfilled && (
              <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">
                {isRtl ? 'مكتمل ✅' : 'Fulfilled ✅'}
              </span>
            )}
          </div>
        </div>

        {/* Right Arrow Navigation Indicator */}
        <div className="self-center shrink-0 text-slate-300 group-hover:text-emerald-800 transition pl-1 rtl:pr-1 rtl:pl-0">
          <ArrowIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Owner Quick Controls (Inline small buttons if owned) */}
      {isOwner && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2"
        >
          {onEdit && (
            <button
              onClick={() => onEdit(need)}
              className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isRtl ? 'تعديل' : 'Edit'}</span>
            </button>
          )}

          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(need)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1 ${
                isFulfilled 
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
              <span>{isFulfilled ? (isRtl ? 'إعادة فتح' : 'Re-open') : (isRtl ? 'تم الاستلام' : 'Mark Done')}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export { NeedCard };
