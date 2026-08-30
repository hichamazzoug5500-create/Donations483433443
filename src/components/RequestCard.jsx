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
  PackageCheck,
  PhoneCall
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
    food: { label: t('catFood'), icon: Utensils, color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
    clothing: { label: t('catClothing'), icon: Shirt, color: 'bg-blue-50 text-blue-900 border-blue-200' },
    medical: { label: t('catMedical'), icon: Stethoscope, color: 'bg-rose-50 text-rose-900 border-rose-200' },
    shelter: { label: t('catShelter'), icon: Home, color: 'bg-amber-50 text-amber-900 border-amber-200' },
    other: { label: t('catOther'), icon: Package, color: 'bg-purple-50 text-purple-900 border-purple-200' }
  };

  const URGENCY_MAP = {
    high: { label: 'حالة عاجلة', color: 'bg-red-600 text-white' },
    medium: { label: 'خلال أيام', color: 'bg-amber-600 text-white' },
    low: { label: 'مستمر', color: 'bg-slate-600 text-white' }
  };

  const categoryMeta = CATEGORY_MAP[request.category] || CATEGORY_MAP.other;
  const CategoryIcon = categoryMeta.icon;
  const urgencyMeta = URGENCY_MAP[request.urgency] || URGENCY_MAP.medium;

  const formattedDate = new Date(request.createdAt).toLocaleDateString('ar-DZ', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-150 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
      request.status === 'fulfilled' 
        ? 'border-slate-200 bg-slate-50/70 opacity-75' 
        : request.status === 'in_progress'
        ? 'border-amber-300 bg-amber-50/15'
        : 'border-slate-200/90 hover:border-emerald-700'
    }`}>
      <div className="p-4 sm:p-5 space-y-3">
        
        {/* Top Badges Bar */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${categoryMeta.color}`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            <span>{categoryMeta.label}</span>
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${urgencyMeta.color}`}>
              {urgencyMeta.label}
            </span>

            {request.status === 'in_progress' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                <PackageCheck className="w-3 h-3 text-amber-600" />
                <span>قيد التكفل</span>
              </span>
            )}

            {request.status === 'fulfilled' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                <CheckCircle className="w-3 h-3 text-emerald-700" />
                <span>مكتمل</span>
              </span>
            )}
          </div>
        </div>

        {/* Organization Name & Location */}
        <div>
          <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-1.5 leading-snug">
            <Building2 className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>{request.orgName}</span>
          </h3>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-bold text-slate-700">{request.location?.city || 'الجزائر'}</span>
            {request.location?.address && (
              <span className="truncate max-w-[180px] sm:max-w-[240px] text-slate-400">
                • {request.location.address}
              </span>
            )}
          </div>
        </div>

        {/* Need description with high Arabic legibility */}
        <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
          {request.needDescription}
        </p>

        {/* Quantity scope if provided */}
        {request.quantity && (
          <div className="bg-slate-50 rounded-xl p-2 sm:p-2.5 text-xs text-slate-800 font-medium border border-slate-200/70 flex items-center justify-between">
            <span className="text-slate-500 font-normal">الكمية المطلوبة:</span>
            <span className="font-bold text-emerald-900">{request.quantity}</span>
          </div>
        )}
      </div>

      {/* Card Footer with full tap target size */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 flex items-center gap-1 text-[11px]">
          <Clock className="w-3 h-3" />
          <span>{formattedDate}</span>
        </span>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isOwner ? (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(request)}
                  className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-white rounded-lg transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                  title="تعديل الطلب"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onToggleStatus && (
                <button
                  onClick={() => onToggleStatus(request)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors min-h-[38px] ${
                    request.status === 'open' 
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  {request.status === 'open' ? 'تعليم كمكتمل' : 'إعادة فتح'}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => onSelect(request)}
              className="flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold px-4 py-2 rounded-xl shadow-xs transition-all text-xs min-h-[40px]"
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
