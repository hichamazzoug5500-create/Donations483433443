import React from 'react';
import { Truck, Phone, Package, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import StatusPipeline from './StatusPipeline';

export default function DispatchCard({ dispatch, onSelectNeed = null }) {
  const { userProfile, isSuperAdmin } = useAuth();
  const { updateDispatchStatus, confirmDispatchDelivery } = useData();
  const { isRtl } = useLanguage();

  const isSender = dispatch.fromBranchId === userProfile?.branchId || isSuperAdmin;
  const isReceiver = dispatch.toBranchId === userProfile?.branchId || isSuperAdmin;

  const handleNextStatus = () => {
    const statuses = ['pledged', 'packing', 'dispatched', 'in_transit', 'delivered', 'confirmed'];
    const currentIdx = statuses.indexOf(dispatch.status);
    if (currentIdx >= 0 && currentIdx < statuses.length - 1) {
      updateDispatchStatus(dispatch.id, statuses[currentIdx + 1]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <Truck className="w-4 h-4" />
            </span>
            <span className="font-bold text-sm text-slate-900">
              {dispatch.fromBranchName} ➔ {dispatch.toBranchName}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {dispatch.fromOrgName}
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          {dispatch.status}
        </span>
      </div>

      {/* Driver & Vehicle Details */}
      {(dispatch.transportDetails?.driverName || dispatch.transportDetails?.estimatedArrival) && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
          {dispatch.transportDetails.driverName && (
            <p className="text-slate-700">
              👤 <strong>{isRtl ? 'السائق' : 'Driver'}:</strong> {dispatch.transportDetails.driverName} 
              {dispatch.transportDetails.vehiclePlate ? ` (${dispatch.transportDetails.vehiclePlate})` : ''} 
              {dispatch.transportDetails.driverPhone ? ` • 📞 ${dispatch.transportDetails.driverPhone}` : ''}
            </p>
          )}
          {dispatch.transportDetails.estimatedArrival && (
            <p className="text-emerald-800 font-medium">
              ⏳ <strong>{isRtl ? 'موعد الوصول المتوقع' : 'ETA'}:</strong> {dispatch.transportDetails.estimatedArrival}
            </p>
          )}
        </div>
      )}

      {/* Visual Status Pipeline */}
      <StatusPipeline
        currentStatus={dispatch.status}
        isOwner={isSender}
        onUpdateStatus={(newStatus) => updateDispatchStatus(dispatch.id, newStatus)}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        {onSelectNeed && dispatch.needId && (
          <button
            onClick={() => onSelectNeed(dispatch.needId)}
            className="text-emerald-800 font-bold hover:underline"
          >
            {isRtl ? 'عرض تفاصيل النداء' : 'View Need Details'}
          </button>
        )}

        <div className="flex items-center gap-2">
          {isSender && dispatch.status !== 'confirmed' && dispatch.status !== 'delivered' && (
            <button
              onClick={handleNextStatus}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs transition"
            >
              {isRtl ? 'تحديث الحالة للمرحلة التالية ➔' : 'Advance Status ➔'}
            </button>
          )}

          {isReceiver && dispatch.status === 'delivered' && (
            <button
              onClick={() => confirmDispatchDelivery(dispatch.id)}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isRtl ? 'تأكيد الاستلام والتفريغ' : 'Confirm Handover'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { DispatchCard };
