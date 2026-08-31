import React, { useState } from 'react';
import { X, Truck, Package, Clock, Phone, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export default function DispatchModal({ isOpen, onClose, targetNeed }) {
  const { userProfile } = useAuth();
  const { createDispatch } = useData();
  const { isRtl } = useLanguage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [transportDetails, setTransportDetails] = useState({
    vehiclePlate: '',
    driverName: '',
    driverPhone: '',
    estimatedArrival: ''
  });
  const [notes, setNotes] = useState('');

  if (!isOpen || !targetNeed) return null;

  const handleItemQuantityChange = (itemId, qty, maxQty) => {
    const numQty = Math.max(0, Math.min(Number(qty) || 0, maxQty));
    setSelectedItems(prev => ({ ...prev, [itemId]: numQty }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemsToDispatch = [];

    (targetNeed.items || []).forEach(item => {
      const dispatchQty = selectedItems[item.itemId];
      if (dispatchQty && dispatchQty > 0) {
        itemsToDispatch.push({
          needItemId: item.itemId,
          category: item.category,
          description: item.description,
          quantity: dispatchQty,
          unit: item.unit
        });
      }
    });

    if (itemsToDispatch.length === 0) {
      alert(isRtl ? 'يرجى تحديد كمية صنف واحد على الأقل للمساعدة' : 'Please select at least one item');
      return;
    }

    setIsSubmitting(true);
    try {
      await createDispatch({
        toOrgId: targetNeed.orgId,
        toOrgName: targetNeed.orgName,
        toBranchId: targetNeed.branchId,
        toBranchName: targetNeed.branchName,
        needId: targetNeed.id,
        items: itemsToDispatch,
        transportDetails,
        notes
      });
      alert(isRtl ? 'تم تسجيل وتجهيز المعونة بنجاح!' : 'Aid dispatch recorded!');
      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-xl border border-slate-200 overflow-hidden my-auto animate-in fade-in">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {isRtl ? 'تجهيز معونة / قافلة إغاثة' : 'Dispatch Aid Convoy'}
              </h2>
              <p className="text-xs text-slate-500">
                {isRtl ? 'موجهة إلى:' : 'To:'} {targetNeed.branchName} ({targetNeed.location?.wilaya})
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Items selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                {isRtl ? 'اختر الأصناف والكميات التي سيوفرها فرعكم:' : 'Select items to commit:'}
              </label>

              <div className="space-y-2">
                {targetNeed.items?.map(item => {
                  const maxPossible = Math.max(0, item.quantity - (item.quantityFulfilled || 0));
                  return (
                    <div key={item.itemId} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{item.description}</span>
                        <span className="text-[11px] text-slate-500">
                          {isRtl ? 'المطلوب' : 'Needed'}: {maxPossible} {item.unit}
                        </span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max={maxPossible}
                        value={selectedItems[item.itemId] || ''}
                        onChange={e => handleItemQuantityChange(item.itemId, e.target.value, maxPossible)}
                        placeholder="0"
                        className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-center bg-white"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transport details */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isRtl ? 'اسم السائق' : 'Driver Name'}
                </label>
                <input
                  type="text"
                  value={transportDetails.driverName}
                  onChange={e => setTransportDetails({ ...transportDetails, driverName: e.target.value })}
                  placeholder="محمد بن علي"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isRtl ? 'رقم هاتف السائق' : 'Driver Phone'}
                </label>
                <input
                  type="tel"
                  value={transportDetails.driverPhone}
                  onChange={e => setTransportDetails({ ...transportDetails, driverPhone: e.target.value })}
                  placeholder="0550 12 34 56"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs dir-ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isRtl ? 'الموعد المقدر للوصول' : 'Estimated Arrival'}
              </label>
              <input
                type="text"
                value={transportDetails.estimatedArrival}
                onChange={e => setTransportDetails({ ...transportDetails, estimatedArrival: e.target.value })}
                placeholder={isRtl ? 'مثال: غداً الساعة 10:00 صباحاً' : 'e.g. Tomorrow 10:00 AM'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              {isSubmitting ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'تأكيد وإرسال' : 'Confirm Dispatch')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { DispatchModal };
