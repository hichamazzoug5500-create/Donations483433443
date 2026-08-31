import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MapPin, 
  Building2, 
  Copy, 
  Check, 
  Navigation, 
  HeartHandshake, 
  Clock, 
  AlertCircle,
  PackageCheck,
  CheckCircle2,
  Calendar,
  Truck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function RequestDetailModal({ isOpen, onClose, request }) {
  const { isRtl } = useLanguage();
  const { userProfile, isSuperAdmin } = useAuth();
  const { commitToNeed } = useData();

  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [pledgeType, setPledgeType] = useState('full'); // 'full' | 'partial'
  const [pledgeData, setPledgeData] = useState({
    providedQuantity: '',
    remainingQuantity: '',
    estimatedArrival: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !request) return null;

  const isOwner = request.branchId === userProfile?.branchId;
  const phoneNumber = request.phone || request.contactPhone || '0550 12 34 56';
  const descriptionText = request.needDescription || request.title || (request.items && request.items[0]?.description) || '';
  const quantityText = request.quantity || (request.items && request.items[0]?.quantity ? `${request.items[0].quantity} ${request.items[0].unit || ''}` : '');
  const locationText = request.location?.city || request.location?.wilaya || 'الجزائر';
  const addressText = request.location?.address || '';

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await commitToNeed(request.id, {
        donorBranchId: userProfile?.branchId || 'donor_demo',
        donorBranchName: userProfile?.branchName || userProfile?.orgName || 'فرع متطوع',
        donorPhone: userProfile?.phone || '',
        commitmentType: pledgeType,
        providedQuantity: pledgeType === 'partial' ? pledgeData.providedQuantity : (quantityText || 'كامل الكمية'),
        remainingQuantity: pledgeType === 'partial' ? pledgeData.remainingQuantity : null,
        estimatedArrival: pledgeData.estimatedArrival,
        notes: pledgeData.notes
      });

      setSuccessMsg(isRtl ? 'تم تسجيل التكفل بنجاح! سيتم إخطار الفرع فوراً.' : 'Aid commitment recorded! The branch has been notified.');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                {request.branchName || request.orgName}
              </h2>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-700" />
                <span>{locationText}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {successMsg ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-emerald-900">{successMsg}</p>
            </div>
          ) : (
            <>
              {/* Category & Urgency Line */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                <span className="px-3 py-1 rounded-lg font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                  {request.category || 'عام'}
                </span>

                <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                  request.urgency === 'high' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {request.urgency === 'high' ? (isRtl ? '🔴 حالة عاجلة جداً' : 'Urgent') : (isRtl ? '🟡 خلال أيام' : 'Normal')}
                </span>
              </div>

              {/* Main Need Description */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {descriptionText}
                </h3>
              </div>

              {/* Quantity Requested */}
              {quantityText && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">{isRtl ? 'الكمية المطلوبة:' : 'Quantity Needed:'}</span>
                  <span className="text-sm font-black text-emerald-900">{quantityText}</span>
                </div>
              )}

              {/* Location & Address */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <span className="text-slate-500 font-semibold block">{isRtl ? 'موقع الاستلام والتسليم:' : 'Drop-off Location:'}</span>
                <p className="font-bold text-slate-900">{locationText} {addressText ? `— ${addressText}` : ''}</p>

                {request.location?.lat && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${request.location.lat},${request.location.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-800 hover:underline font-bold text-[11px] pt-1"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'فتح في خرائط Google 🗺️' : 'Open in Google Maps'}</span>
                  </a>
                )}
              </div>

              {/* PRIMARY HERO ACTION: 1-Tap Direct Phone Call */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">
                    {isRtl ? '📞 التواصل الهاتفي المباشر مع المنسق:' : 'Direct Coordinator Call:'}
                  </span>
                  <button
                    onClick={handleCopyPhone}
                    className="text-[11px] text-emerald-800 hover:underline font-bold flex items-center gap-1"
                  >
                    {copiedPhone ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPhone ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الرقم' : 'Copy')}</span>
                  </button>
                </div>

                <a
                  href={`tel:${phoneNumber}`}
                  className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Phone className="w-4 h-4" />
                  <span className="font-mono text-base tracking-wide dir-ltr">{phoneNumber}</span>
                  <span>— {isRtl ? 'اتصل الآن' : 'Call Now'}</span>
                </a>
              </div>

              {/* PLEDGE AID / COMMIT SECTION (If not owner) */}
              {!isOwner && (
                <div className="pt-2">
                  {!showPledgeForm ? (
                    <button
                      onClick={() => setShowPledgeForm(true)}
                      className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition"
                    >
                      <HeartHandshake className="w-4 h-4 text-emerald-400" />
                      <span>{isRtl ? 'التكفل وتأكيد إرسال المعونة من فرعكم 🤝' : 'Commit Aid & Dispatch Help 🤝'}</span>
                    </button>
                  ) : (
                    <form onSubmit={handlePledgeSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          {isRtl ? 'نوع التكفل بالمعونة:' : 'Commitment Type:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowPledgeForm(false)}
                          className="text-[11px] text-slate-400 hover:text-slate-600"
                        >
                          {isRtl ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>

                      {/* Full vs Partial Toggle */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPledgeType('full')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            pledgeType === 'full' 
                              ? 'bg-emerald-800 text-white border-emerald-800' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <PackageCheck className="w-4 h-4" />
                          <span>{isRtl ? 'تكفل كامل' : 'Full Pledge'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPledgeType('partial')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            pledgeType === 'partial' 
                              ? 'bg-emerald-800 text-white border-emerald-800' 
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Truck className="w-4 h-4" />
                          <span>{isRtl ? 'تكفل جزئي' : 'Partial Pledge'}</span>
                        </button>
                      </div>

                      {/* Partial Quantities */}
                      {pledgeType === 'partial' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              {isRtl ? 'الكمية التي سيوفرها فرعكم *' : 'Amount you will provide *'}
                            </label>
                            <input
                              required
                              type="text"
                              placeholder="مثال: 20 قفة"
                              value={pledgeData.providedQuantity}
                              onChange={e => setPledgeData({ ...pledgeData, providedQuantity: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              {isRtl ? 'الكمية المتبقية المطلوبة' : 'Remaining needed'}
                            </label>
                            <input
                              type="text"
                              placeholder="مثال: 30 قفة متبقية"
                              value={pledgeData.remainingQuantity}
                              onChange={e => setPledgeData({ ...pledgeData, remainingQuantity: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                            />
                          </div>
                        </div>
                      )}

                      {/* Estimated Arrival */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          {isRtl ? 'الموعد المتوقع للتسليم (اختياري)' : 'Estimated Delivery Time (Optional)'}
                        </label>
                        <input
                          type="text"
                          placeholder={isRtl ? 'مثال: غداً صباحاً الساعة 10:00' : 'e.g. Tomorrow 10:00 AM'}
                          value={pledgeData.estimatedArrival}
                          onChange={e => setPledgeData({ ...pledgeData, estimatedArrival: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        {isSubmitting ? (isRtl ? 'جاري التأكيد...' : 'Confirming...') : (isRtl ? 'تأكيد الالتزام بالمعونة' : 'Confirm Aid Commitment')}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            {isRtl ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}

export { RequestDetailModal };
