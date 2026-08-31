import React from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Package, 
  CheckCircle, 
  Clock, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import StatusPipeline from './StatusPipeline';

export default function DispatchCard({ dispatch, onSelectNeed = null }) {
  const { userProfile, isSuperAdmin } = useAuth();
  const { updateDispatchStatus, confirmDispatchDelivery } = useData();
  const { isRtl } = useLanguage();

  const isSender = dispatch.fromBranchId === userProfile?.branchId;
  const isReceiver = dispatch.toBranchId === userProfile?.branchId;
  const canAdvance = isSender || isSuperAdmin;

  const nextStatusMap = {
    'pledged': 'packing',
    'packing': 'dispatched',
    'dispatched': 'in_transit',
    'in_transit': 'delivered'
  };

  const handleAdvanceStatus = () => {
    const next = nextStatusMap[dispatch.status];
    if (next) {
      updateDispatchStatus(dispatch.id, next);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-4">
      {/* Header: Route & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{dispatch.fromOrgName}</span>
            <span>➔</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{dispatch.toOrgName}</span>
          </div>

          <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            <span>{dispatch.fromBranchName}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4 text-slate-400 shrink-0" /> : <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />}
            <span>{dispatch.toBranchName}</span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold self-start sm:self-center">
          {dispatch.status}
        </span>
      </div>

      {/* Visual Pipeline */}
      <StatusPipeline currentStatus={dispatch.status} />

      {/* Cargo Breakdown */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
        <span className="font-bold text-slate-700 dark:text-slate-300 block">{isRtl ? 'حمولة القافلة' : 'Cargo'}:</span>
        <div className="flex flex-wrap gap-2">
          {dispatch.items?.map((it, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono text-xs">
              {it.description}: <strong>{it.quantity} {it.unit}</strong>
            </span>
          ))}
        </div>
      </div>

      {/* Driver & ETA Details */}
      {(dispatch.transportDetails?.driverName || dispatch.transportDetails?.estimatedArrival) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
          {dispatch.transportDetails?.driverName && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span>{isRtl ? 'السائق' : 'Driver'}: <strong>{dispatch.transportDetails.driverName}</strong> {dispatch.transportDetails.vehiclePlate ? `(${dispatch.transportDetails.vehiclePlate})` : ''}</span>
              {dispatch.transportDetails.driverPhone && (
                <a href={`tel:${dispatch.transportDetails.driverPhone}`} className="text-emerald-600 font-bold hover:underline">
                  📞 {dispatch.transportDetails.driverPhone}
                </a>
              )}
            </div>
          )}

          {dispatch.transportDetails?.estimatedArrival && (
            <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-medium">
              ⏳ {isRtl ? 'الوصول المتوقع' : 'ETA'}: {dispatch.transportDetails.estimatedArrival}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {onSelectNeed && dispatch.needId && (
          <button
            onClick={() => onSelectNeed(dispatch.needId)}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>{isRtl ? 'عرض نداء الإغاثة المرتبط ➔' : 'View Related Need ➔'}</span>
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Sender Status Advance */}
          {canAdvance && nextStatusMap[dispatch.status] && (
            <button
              onClick={handleAdvanceStatus}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{isRtl ? `تحديث الحالة إلى: ${nextStatusMap[dispatch.status]}` : `Advance: ${nextStatusMap[dispatch.status]}`}</span>
            </button>
          )}

          {/* Receiver Delivery Confirmation */}
          {isReceiver && dispatch.status === 'delivered' && (
            <button
              onClick={() => confirmDispatchDelivery(dispatch.id)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isRtl ? 'تأكيد الاستلام والتفريغ' : 'Confirm Receipt'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
