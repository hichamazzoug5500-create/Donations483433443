import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  MapPin, 
  Package, 
  Truck, 
  Phone, 
  Users, 
  Clock, 
  Globe2, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Share2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Building2,
  Navigation
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import StatusPipeline from '../components/StatusPipeline';
import DispatchModal from '../components/DispatchModal';

export default function NeedDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { needs, dispatches, deleteNeed, updateNeed, confirmDispatchDelivery } = useData();
  const { userProfile, isSuperAdmin } = useAuth();
  const { isRtl, t } = useLanguage();

  const [showDispatchModal, setShowDispatchModal] = useState(false);

  const need = needs.find(n => n.id === id);

  if (!need) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          {isRtl ? 'نداء الإغاثة غير موجود أو تم حذفه' : 'Relief need not found or has been removed'}
        </h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-md hover:bg-emerald-700 transition"
        >
          {isRtl ? 'العودة للوحة القيادة' : 'Back to Dashboard'}
        </button>
      </div>
    );
  }

  const isOwnBranch = need.branchId === userProfile?.branchId;
  const canManage = isOwnBranch || isSuperAdmin;

  // Filter Dispatches committed to this need
  const needDispatches = dispatches.filter(d => d.needId === need.id);

  // Calculate fulfillment stats
  const totalQty = (need.items || []).reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);
  const totalFulfilled = (need.items || []).reduce((acc, it) => acc + (Number(it.quantityFulfilled) || 0), 0);
  const overallPercent = totalQty > 0 ? Math.min(100, Math.round((totalFulfilled / totalQty) * 100)) : 0;

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'P1_critical':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-sm">P1 - {isRtl ? 'حرج (0-24س)' : 'Critical'}</span>;
      case 'P2_urgent':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">P2 - {isRtl ? 'عاجل (24-48س)' : 'Urgent'}</span>;
      case 'P3_high':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">P3 - {isRtl ? 'أولوية مرتفعة' : 'High'}</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-500 text-white">P4 - {isRtl ? 'متوسط' : 'Medium'}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Back Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRtl ? 'العودة للوحة القيادة وموجز الاحتياجات' : 'Back to Dashboard'}</span>
        </button>

        {canManage && (
          <div className="flex items-center gap-2">
            {need.status !== 'fulfilled' && (
              <button
                onClick={() => updateNeed(need.id, { status: 'fulfilled' })}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isRtl ? 'تعليم كمكتمل' : 'Mark Fulfilled'}</span>
              </button>
            )}

            <button
              onClick={() => {
                if (confirm(isRtl ? 'هل أنت متأكد من حذف هذا النداء؟' : 'Delete this relief need?')) {
                  deleteNeed(need.id);
                  navigate('/dashboard');
                }
              }}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              title={isRtl ? 'حذف النداء' : 'Delete Need'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Details Left, Map & Logistics Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Need Details & Items */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {getPriorityBadge(need.priority)}
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                {need.disasterType}
              </span>
              {need.isCrossOrg && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تنسيق مشترك مع كافة المنظمات' : 'Open Cross-Org'}</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3 leading-snug">
              {need.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>{need.orgName}</span>
              </span>
              <span>•</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{need.branchName}</span>
              <span>•</span>
              <span className="text-slate-500 font-mono">{need.location?.wilaya}</span>
            </div>

            {/* Notes / Situation Summary */}
            {need.notes && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                <p className="font-bold text-xs text-amber-800 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تقرير الوضع الميداني من الفرع' : 'Field Situation Notes'}</span>
                </p>
                <p className="text-xs sm:text-sm">{need.notes}</p>
              </div>
            )}

            {/* Fulfillment Status Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold">{isRtl ? 'نسبة الاستجابة وتغطية الاحتياج' : 'Fulfillment Rate'}</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{overallPercent}% {isRtl ? 'مكتمل' : 'Covered'}</p>
              </div>

              {!isOwnBranch && (
                <button
                  onClick={() => setShowDispatchModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-lg transition flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>{isRtl ? 'تجهيز وإرسال معونة' : 'Commit & Dispatch Aid'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Requested Items Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <span>{isRtl ? 'تفاصيل الأصناف والمستلزمات المطلوبة' : 'Requested Items Breakdown'} ({need.items?.length || 0})</span>
            </h2>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {need.items?.map((item, idx) => {
                const itemPercent = item.quantity > 0 
                  ? Math.min(100, Math.round(((item.quantityFulfilled || 0) / item.quantity) * 100)) 
                  : 0;
                const remaining = Math.max(0, item.quantity - (item.quantityFulfilled || 0));

                return (
                  <div key={item.itemId || idx} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white block">
                          {item.description}
                        </span>
                        <span className="text-xs text-slate-500">
                          {isRtl ? 'التصنيف' : 'Category'}: {item.category}
                        </span>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="text-slate-900 dark:text-white font-bold block">
                          {item.quantityFulfilled || 0} / {item.quantity} {item.unit}
                        </span>
                        <span className={`text-[11px] font-bold ${remaining === 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {remaining === 0 ? (isRtl ? 'مكتمل بالكامل ✅' : 'Fully Covered ✅') : `${isRtl ? 'متبقي' : 'Remaining'}: ${remaining} ${item.unit}`}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
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
            </div>
          </div>

          {/* Dispatch & Convoy History */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>{isRtl ? 'سجل قوافل المساعدات الموجهة لهذا النداء' : 'Aid Convoys & Dispatches History'} ({needDispatches.length})</span>
            </h2>

            {needDispatches.length === 0 ? (
              <div className="py-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                <Truck className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">{isRtl ? 'لم يتم تسجيل أي قافلة بعد لهذا النداء.' : 'No aid convoys dispatched for this need yet.'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {needDispatches.map(disp => (
                  <div key={disp.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {isRtl ? 'من' : 'From'}: {disp.fromBranchName} ({disp.fromOrgName})
                        </h3>
                        {disp.transportDetails?.driverName && (
                          <p className="text-xs text-slate-500">
                            {isRtl ? 'السائق' : 'Driver'}: {disp.transportDetails.driverName} {disp.transportDetails.vehiclePlate ? `(${disp.transportDetails.vehiclePlate})` : ''} • {disp.transportDetails.driverPhone}
                          </p>
                        )}
                        {disp.transportDetails?.estimatedArrival && (
                          <p className="text-xs text-emerald-600 font-medium mt-0.5">
                            ⏳ {isRtl ? 'موعد الوصول المتوقع' : 'ETA'}: {disp.transportDetails.estimatedArrival}
                          </p>
                        )}
                      </div>

                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                        {disp.status}
                      </span>
                    </div>

                    {/* Visual Status Pipeline */}
                    <StatusPipeline currentStatus={disp.status} />

                    {/* Items Dispatched */}
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                      <p className="font-bold text-slate-700 dark:text-slate-300">{isRtl ? 'حمولة القافلة' : 'Cargo'}:</p>
                      <div className="flex flex-wrap gap-2">
                        {disp.items?.map((it, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono">
                            {it.description}: <strong>{it.quantity} {it.unit}</strong>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Confirmation Action for Receiving Branch */}
                    {isOwnBranch && disp.status === 'delivered' && (
                      <button
                        onClick={() => confirmDispatchDelivery(disp.id)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{isRtl ? 'تأكيد استلام الشحنة وتفريغها بالمستودع' : 'Confirm Receipt & Warehouse Check-in'}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Location, Access, Coordinator */}
        <div className="space-y-6">
          
          {/* Location & Access Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <span>{isRtl ? 'الموقع الميداني وحالة الطرق' : 'Location & Road Access'}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">{isRtl ? 'الولاية والعنوان' : 'Wilaya & Address'}</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {need.location?.wilaya} — {need.location?.address}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">{isRtl ? 'حالة المسالك' : 'Access Status'}</span>
                <p className="font-bold text-slate-900 dark:text-white">
                  {need.location?.accessStatus === 'open' && `🟢 ${isRtl ? 'مسالك سالكة ومفتوحة' : 'Open / Accessible'}`}
                  {need.location?.accessStatus === 'obstructed' && `🟡 ${isRtl ? 'مسالك بها عوائق وصعبة' : 'Obstructed'}`}
                  {need.location?.accessStatus === 'cut_off' && `🔴 ${isRtl ? 'منطقة مقطوعة ومعزولة' : 'Cut Off / Isolated'}`}
                </p>
              </div>
            </div>

            {need.location?.lat && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${need.location.lat},${need.location.lng}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>{isRtl ? 'فتح في خرائط Google' : 'Open in Google Maps'}</span>
              </a>
            )}
          </div>

          {/* Field Coordinator Box */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-600" />
              <span>{isRtl ? 'مسؤول التنسيق الميداني' : 'Field Coordinator'}</span>
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-3">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{need.contactName || (isRtl ? 'منسق الطوارئ' : 'Field Coordinator')}</p>
                <p className="text-xs text-slate-500">{need.branchName}</p>
              </div>

              {need.contactPhone && (
                <a
                  href={`tel:${need.contactPhone}`}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isRtl ? 'اتصال مباشر' : 'Call'}: {need.contactPhone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Affected Population Stats */}
          {need.affectedPopulation && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>{isRtl ? 'إحصائيات المتضررين' : 'Affected Population'}</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{need.affectedPopulation.households || 0}</span>
                  <span className="text-xs text-slate-500 block">{isRtl ? 'عائلة متضررة' : 'Families'}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{need.affectedPopulation.individuals || 0}</span>
                  <span className="text-xs text-slate-500 block">{isRtl ? 'إجمالي الأفراد' : 'Individuals'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dispatch Modal Popup */}
      {showDispatchModal && (
        <DispatchModal
          isOpen={showDispatchModal}
          onClose={() => setShowDispatchModal(false)}
          targetNeed={need}
        />
      )}
    </div>
  );
}
