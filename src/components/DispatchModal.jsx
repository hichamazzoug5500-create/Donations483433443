import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  Package, 
  MapPin, 
  Calendar, 
  Phone, 
  CheckCircle, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export default function DispatchModal({ isOpen, onClose, targetNeed }) {
  const { userProfile } = useAuth();
  const { createDispatch } = useData();
  const { isRtl, t } = useLanguage();

  const [submitting, setSubmitting] = useState(false);

  // Selected items with pledged quantities
  const [selectedItems, setSelectedItems] = useState(() => {
    return (targetNeed?.items || []).map(item => {
      const remaining = Math.max(0, (Number(item.quantity) || 0) - (Number(item.quantityFulfilled) || 0));
      return {
        needItemId: item.itemId,
        category: item.category,
        description: item.description,
        unit: item.unit,
        maxRemaining: remaining,
        quantity: remaining > 0 ? remaining : item.quantity,
        isSelected: remaining > 0 // auto-select items with remaining deficit
      };
    });
  });

  // Transport & Driver Details
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState(userProfile?.phone || '');
  const [estimatedArrival, setEstimatedArrival] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen || !targetNeed) return null;

  const handleToggleItem = (index) => {
    const next = [...selectedItems];
    next[index].isSelected = !next[index].isSelected;
    setSelectedItems(next);
  };

  const handleQuantityChange = (index, val) => {
    const next = [...selectedItems];
    next[index].quantity = Math.max(1, Number(val) || 1);
    setSelectedItems(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemsToDispatch = selectedItems
      .filter(it => it.isSelected && it.quantity > 0)
      .map(it => ({
        needItemId: it.needItemId,
        category: it.category,
        description: it.description,
        quantity: Number(it.quantity),
        unit: it.unit
      }));

    if (itemsToDispatch.length === 0) {
      alert(isRtl ? 'يرجى تحديد صنف واحد على الأقل لإرساله في القافلة' : 'Please select at least one item to dispatch');
      return;
    }

    setSubmitting(true);
    try {
      await createDispatch({
        needId: targetNeed.id,
        toOrgId: targetNeed.orgId,
        toOrgName: targetNeed.orgName,
        toBranchId: targetNeed.branchId,
        toBranchName: targetNeed.branchName,
        items: itemsToDispatch,
        transportDetails: {
          vehiclePlate: vehiclePlate.trim(),
          driverName: driverName.trim() || userProfile?.displayName || '',
          driverPhone: driverPhone.trim(),
          estimatedArrival: estimatedArrival.trim()
        },
        notes: notes.trim()
      });

      onClose();
    } catch (err) {
      alert("Error creating dispatch: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold">
                {isRtl ? 'تجهيز وإرسال قافلة إغاثة' : 'Dispatch Aid Convoy'}
              </h2>
              <p className="text-xs text-emerald-100">
                {isRtl ? 'من فرعكم إلى' : 'From your branch to'}: {targetNeed.branchName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Target Summary Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <p className="font-bold text-slate-900 dark:text-white text-sm">{targetNeed.title}</p>
            <p className="text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{targetNeed.location?.wilaya} — {targetNeed.location?.address}</span>
            </p>
          </div>

          {/* Items Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>{isRtl ? 'حدد الأصناف والكميات التي سيتم إرسالها' : 'Select Cargo & Quantities'}</span>
            </label>

            <div className="space-y-2.5">
              {selectedItems.map((item, idx) => (
                <div
                  key={item.needItemId || idx}
                  className={`p-3 rounded-2xl border transition ${
                    item.isSelected
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={item.isSelected}
                        onChange={() => handleToggleItem(idx)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.description}
                      </span>
                    </label>

                    {item.isSelected && (
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={e => handleQuantityChange(idx, e.target.value)}
                          className="w-20 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold text-center"
                        />
                        <span className="text-xs font-mono text-slate-500">{item.unit}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transport & Driver Details */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>{isRtl ? 'بيانات النقل وسائق القافلة' : 'Transport & Convoy Details'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">{isRtl ? 'اسم السائق / قائد القافلة' : 'Driver / Convoy Lead'}</label>
                <input
                  type="text"
                  placeholder="مثال: مراد بلحاج"
                  value={driverName}
                  onChange={e => setDriverName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">{isRtl ? 'رقم هاتف السائق' : 'Driver Phone'} *</label>
                <input
                  type="text"
                  required
                  placeholder="0550112233"
                  value={driverPhone}
                  onChange={e => setDriverPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">{isRtl ? 'ترقيم الشاحنة / المركبة' : 'Vehicle Plate'}</label>
                <input
                  type="text"
                  placeholder="00145-124-16"
                  value={vehiclePlate}
                  onChange={e => setVehiclePlate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">{isRtl ? 'الموعد المقدر للوصول' : 'Estimated Arrival'}</label>
                <input
                  type="text"
                  placeholder="اليوم خلال 3 ساعات"
                  value={estimatedArrival}
                  onChange={e => setEstimatedArrival(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">{isRtl ? 'ملاحظات وتوجيهات الاستلام' : 'Logistics Notes'}</label>
              <textarea
                rows={2}
                placeholder="تنسيق مسبق مع الدفاع المدني..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 text-xs font-bold transition"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>{submitting ? (isRtl ? 'جاري الإرسال...' : 'Dispatching...') : (isRtl ? 'تأكيد انطلاق الشحنة' : 'Confirm Dispatch')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
