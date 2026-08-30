import React from 'react';
import { 
  Utensils, 
  Shirt, 
  Stethoscope, 
  Home, 
  Package, 
  MapPin, 
  Clock, 
  Eye, 
  CheckCircle, 
  Edit2,
  Building2,
  PackageCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const RequestCard = ({ 
  request, 
  onSelect, 
  onEdit, 
  onToggleStatus, 
  isOwner = false 
}) => {
  const { t } = useLanguage();

  const CATEGORY_MAP = {
    food: { label: t('catFood'), icon: Utensils, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    clothing: { label: t('catClothing'), icon: Shirt, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    medical: { label: t('catMedical'), icon: Stethoscope, color: 'bg-rose-100 text-rose-800 border-rose-200' },
    shelter: { label: t('catShelter'), icon: Home, color: 'bg-amber-100 text-amber-800 border-amber-200' },
    other: { label: t('catOther'), icon: Package, color: 'bg-purple-100 text-purple-800 border-purple-200' }
  };

  const URGENCY_MAP = {
    high: { label: t('urgencyHigh'), color: 'bg-red-500 text-white' },
    medium: { label: t('urgencyMedium'), color: 'bg-amber-500 text-white' },
    low: { label: t('urgencyLow'), color: 'bg-slate-500 text-white' }
  };

  const categoryMeta = CATEGORY_MAP[request.category] || CATEGORY_MAP.other;
  const CategoryIcon = categoryMeta.icon;
  const urgencyMeta = URGENCY_MAP[request.urgency] || URGENCY_MAP.medium;

  const formattedDate = new Date(request.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden ${
      request.status === 'fulfilled' 
        ? 'border-slate-200 bg-slate-50/70 opacity-80' 
        : request.status === 'in_progress'
        ? 'border-amber-300 bg-amber-50/20'
        : 'border-slate-200 hover:border-teal-300'
    }`}>
      <div className="p-5 space-y-3.5">
        
        {/* Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${categoryMeta.color}`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            {categoryMeta.label}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${urgencyMeta.color}`}>
              {urgencyMeta.label}
            </span>

            {request.status === 'in_progress' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                <PackageCheck className="w-3 h-3 text-amber-600" />
                {t('statusInProgress')}
              </span>
            )}

            {request.status === 'fulfilled' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                {t('fulfilledRequests')}
              </span>
            )}
          </div>
        </div>

        {/* Org Name */}
        <div>
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-teal-600 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{request.orgName}</span>
          </h3>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-600">{request.location?.city || 'الجزائر'}</span>
            {request.location?.address && <span className="truncate max-w-[200px]">• {request.location.address}</span>}
          </div>
        </div>

        {/* Need description */}
        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
          {request.needDescription}
        </p>

        {/* Quantity */}
        {request.quantity && (
          <div className="bg-slate-100 rounded-xl p-2.5 text-xs text-slate-700 font-medium border border-slate-200/60 flex items-center justify-between">
            <span className="text-slate-500 font-normal">{t('quantityNeeded')}</span>
            <span className="font-bold text-teal-800">{request.quantity}</span>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formattedDate}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isOwner ? (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(request)}
                  className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-white rounded transition-colors"
                  title={t('editRequest')}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onToggleStatus && (
                <button
                  onClick={() => onToggleStatus(request)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    request.status === 'open' 
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  {request.status === 'open' ? t('markFulfilled') : t('reopenNeed')}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => onSelect(request)}
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition-all transform active:scale-95 text-xs min-h-[36px]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>استعراض والتكفل</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
