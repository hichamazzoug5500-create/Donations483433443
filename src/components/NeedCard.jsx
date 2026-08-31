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
  PieChart,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function NeedCard({ 
  need, 
  onSelect, 
  onEdit, 
  onToggleStatus 
}) {
  const { isRtl, lang } = useLanguage();
  const { userProfile } = useAuth();

  const isOwner = need.branchId === userProfile?.branchId;

  const CATEGORY_MAP = {
    food: { label: isRtl ? 'مواد غذائية ومؤونة' : 'Food & Nutrition', icon: Utensils, color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
    clothing: { label: isRtl ? 'ألبسة وأغطية' : 'Clothing & Blankets', icon: Shirt, color: 'bg-blue-50 text-blue-900 border-blue-200' },
    medical: { label: isRtl ? 'أدوية ومستلزمات طبية' : 'Medicine & Medical', icon: Stethoscope, color: 'bg-rose-50 text-rose-900 border-rose-200' },
    shelter: { label: isRtl ? 'مأوى وسكن مؤقت' : 'Temporary Shelter', icon: Home, color: 'bg-amber-50 text-amber-900 border-amber-200' },
    other: { label: isRtl ? 'عام / احتياجات أخرى' : 'General / Other', icon: Package, color: 'bg-purple-50 text-purple-900 border-purple-200' }
  };

  const URGENCY_MAP = {
    high: { label: isRtl ? 'حالة عاجلة' : 'Urgent (Emergency)', color: 'bg-red-600 text-white' },
    medium: { label: isRtl ? 'خلال أيام' : 'Within Days', color: 'bg-amber-600 text-white' },
    low: { label: isRtl ? 'مستمر' : 'Ongoing', color: 'bg-slate-600 text-white' },
    P1_critical: { label: isRtl ? 'حالة عاجلة' : 'Urgent (Emergency)', color: 'bg-red-600 text-white' },
    P2_urgent: { label: isRtl ? 'خلال أيام' : 'Within Days', color: 'bg-amber-600 text-white' },
    P3_high: { label: isRtl ? 'مستمر' : 'Ongoing', color: 'bg-slate-600 text-white' }
  };

  const categoryMeta = CATEGORY_MAP[need.category] || CATEGORY_MAP.other;
  const CategoryIcon = categoryMeta.icon;
  const urgencyMeta = URGENCY_MAP[need.urgency] || URGENCY_MAP[need.priority] || URGENCY_MAP.medium;

  const formattedDate = new Date(need.createdAt).toLocaleDateString(isRtl ? 'ar-DZ' : 'en-US', {
    month: 'short',
    day: 'numeric'
  });

  const displayQuantity = need.quantity || (need.items && need.items[0]?.quantity ? `${need.items[0].quantity} ${need.items[0].unit || ''}` : '');
  const descriptionText = need.needDescription || need.title || (need.items && need.items[0]?.description) || '';

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-150 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
      need.status === 'fulfilled' 
        ? 'border-slate-200 bg-slate-50/70 opacity-75' 
        : need.status === 'in_progress'
        ? 'border-amber-300 bg-amber-50/15'
        : need.remainingQuantity
        ? 'border-amber-300/80 bg-amber-50/10 hover:border-amber-500'
        : 'border-slate-200/90 hover:border-emerald-700'
    }`}>
      <div className="p-4 sm:p-5 space-y-3">
        
        {/* Top Badges Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${categoryMeta.color}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              <span>{categoryMeta.label}</span>
            </span>

            {need.remainingQuantity && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <PieChart className="w-3 h-3 text-amber-600" />
                <span>{isRtl ? 'تكفل جزئي' : 'Partial Aid'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${urgencyMeta.color}`}>
              {urgencyMeta.label}
            </span>

            {need.status === 'in_progress' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                <PackageCheck className="w-3 h-3 text-amber-600" />
                <span>{isRtl ? 'قيد التكفل والتنسيق' : 'In Progress'}</span>
              </span>
            )}

            {need.status === 'fulfilled' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                <CheckCircle className="w-3 h-3 text-emerald-700" />
                <span>{isRtl ? 'مكتمل' : 'Fulfilled'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Organization / Branch Name & Location */}
        <div>
          <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-1.5 leading-snug">
            <Building2 className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>{need.branchName || need.orgName}</span>
          </h3>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-bold text-slate-700">{need.location?.city || need.location?.wilaya || 'الجزائر'}</span>
            {need.location?.address && (
              <span className="truncate max-w-[180px] sm:max-w-[240px] text-slate-400">
                • {need.location.address}
              </span>
            )}
          </div>
        </div>

        {/* Need description */}
        <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
          {descriptionText}
        </p>

        {/* Quantity scope & Remaining Needed */}
        <div className="space-y-1.5">
          {displayQuantity && (
            <div className="bg-slate-50 rounded-xl p-2 sm:p-2.5 text-xs text-slate-800 font-medium border border-slate-200/70 flex items-center justify-between">
              <span className="text-slate-500 font-normal">{isRtl ? 'الكمية المطلوبة:' : 'Quantity Needed:'}</span>
              <span className="font-bold text-emerald-900">{displayQuantity}</span>
            </div>
          )}

          {need.remainingQuantity && (
            <div className="bg-amber-50 rounded-xl p-2 sm:p-2.5 text-xs text-amber-950 font-bold border border-amber-300 flex items-center justify-between">
              <span className="text-amber-800 font-medium flex items-center gap-1">
                <PieChart className="w-3.5 h-3.5 text-amber-600" />
                <span>{isRtl ? 'المتبقي المطلوب:' : 'Remaining Needed:'}</span>
              </span>
              <span className="text-amber-900 font-extrabold">{need.remainingQuantity}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
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
                  onClick={() => onEdit(need)}
                  className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-white rounded-lg transition min-h-[38px] min-w-[38px] flex items-center justify-center"
                  title={isRtl ? 'تعديل الطلب' : 'Edit Request'}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onToggleStatus && (
                <button
                  onClick={() => onToggleStatus(need)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[38px] ${
                    need.status === 'open' || need.status === 'active'
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  {need.status === 'open' || need.status === 'active' ? (isRtl ? 'تعليم كمكتمل' : 'Mark Fulfilled') : (isRtl ? 'إعادة فتح' : 'Re-open')}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => onSelect(need)}
              className="flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold px-4 py-2 rounded-xl shadow-xs transition-all text-xs min-h-[40px]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isRtl ? 'استعراض والتكفل' : 'View & Pledge'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
