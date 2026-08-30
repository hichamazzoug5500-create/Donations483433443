import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Building2, 
  PhoneCall, 
  CheckCircle2, 
  Copy, 
  HeartHandshake,
  Calendar,
  PackageCheck,
  FileText,
  AlertCircle
} from 'lucide-react';
import { MapView } from './MapView';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const RequestDetailModal = ({ request, onClose }) => {
  const { commitToRequest, cancelCommitment } = useData();
  const { userProfile, role: userRole } = useAuth();
  const { t } = useLanguage();

  const [copied, setCopied] = useState(false);
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [pledgedQuantity, setPledgedQuantity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [donorNotes, setDonorNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!request) return null;

  const isAlreadyCommittedByMe = Boolean(
    userProfile?.uid && request.assignedDonorId === userProfile.uid
  );

  const copyPhone = () => {
    if (request.phone) {
      navigator.clipboard.writeText(request.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCommitSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await commitToRequest(request.requestId, {
        pledgedQuantity,
        deliveryDate,
        donorNotes
      });
      setShowPledgeForm(false);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 4000);
    } catch (err) {
      console.error("Error committing to request:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelCommitment = async () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إلغاء التزامك بهذه المساعدة؟')) {
      setIsCancelling(true);
      try {
        await cancelCommitment(request.requestId);
      } catch (err) {
        console.error("Error cancelling commitment:", err);
      } finally {
        setIsCancelling(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      
      {/* Mobile Bottom Sheet & Desktop Centered Modal */}
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200">
        
        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-full pt-3 pb-1 flex justify-center bg-slate-900">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-start justify-between relative shrink-0">
          <div className="space-y-1.5 pr-6 rtl:pl-6 rtl:pr-0">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                request.status === 'fulfilled'
                  ? 'bg-slate-700 text-slate-300'
                  : request.status === 'in_progress'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-600 text-white'
              }`}>
                {request.status === 'fulfilled' 
                  ? 'تمت التلبية' 
                  : request.status === 'in_progress' 
                  ? 'قيد التكفل' 
                  : 'مفتوح للمساعدة'}
              </span>
              
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {request.urgency === 'high' ? 'حالة عاجلة' : request.urgency === 'medium' ? 'متوسط' : 'عادي'}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{request.orgName}</span>
            </h2>
            
            <p className="text-slate-300 text-xs flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{request.location?.city} {request.location?.address ? `• ${request.location.address}` : ''}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-grow pb-20 sm:pb-6">
          
          {/* Detailed Need Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              تفاصيل الاحتياج المطلوب:
            </h3>
            <p className="text-slate-800 leading-relaxed whitespace-pre-line text-sm bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {request.needDescription}
            </p>
          </div>

          {/* Scope / Quantity */}
          {request.quantity && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 block">الكمية المطلوبة:</span>
                <span className="text-emerald-950 font-extrabold text-sm sm:text-base">{request.quantity}</span>
              </div>
              <HeartHandshake className="w-6 h-6 text-emerald-600 opacity-60" />
            </div>
          )}

          {/* Map Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>موقع الاستلام والتسليم:</span>
            </h3>
            <div className="h-36 sm:h-44 w-full rounded-xl overflow-hidden border border-slate-200">
              <MapView requests={[request]} selectedRequestId={request.requestId} zoomLevel={13} />
            </div>
          </div>

          {/* Direct Phone Call Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-800" />
                <span>رقم هاتف الجمعية المباشر:</span>
              </span>
              <span className="text-sm font-extrabold text-slate-900 dir-ltr">
                {request.phone || 'غير متوفر'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={copyPhone}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs min-h-[44px] transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'تم النسخ!' : 'نسخ الرقم'}</span>
              </button>

              <a
                href={`tel:${request.phone}`}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold rounded-xl text-xs shadow-xs min-h-[44px] transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>اتصال هاتفي</span>
              </a>
            </div>
          </div>

          {/* Mission Commitment Section */}
          <div className="border-t border-slate-200 pt-4">
            
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-xl mb-3 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>تم تسجيل التزامك بنجاح!</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  شكراً لك! يرجى الاتصال بالجمعية هاتفياً لتنسيق موعد ومكان تسليم المساعدات.
                </p>
              </div>
            )}

            {isAlreadyCommittedByMe ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>أنت ملتزم رسمياً بتقديم هذه المساعدة</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md font-bold">
                    نشط
                  </span>
                </div>
                
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  تم إشعار الجمعية بالتزامك. يرجى التواصل معهم هاتفياً للتنسيق والتسليم.
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleCancelCommitment}
                    disabled={isCancelling}
                    className="text-xs text-red-700 hover:underline font-semibold"
                  >
                    {isCancelling ? 'جاري الإلغاء...' : 'إلغاء التزامي بالمهمة'}
                  </button>
                </div>
              </div>
            ) : request.status === 'fulfilled' ? (
              <div className="bg-slate-100 border border-slate-200 text-slate-700 p-3.5 rounded-xl text-center text-xs font-semibold">
                تم تلبية هذا الاحتياج بالكامل. شكراً لجميع المحسنين.
              </div>
            ) : (
              <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-emerald-400" />
                    <span>التكفل الرسمي بهذه المساعدة (قبول المهمة)</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    إذا قررت توفير هذه المساعدة، يمكنك تأكيد التزامك الرسمي لإشعار الجمعية.
                  </p>
                </div>

                {!showPledgeForm ? (
                  <button
                    type="button"
                    onClick={() => setShowPledgeForm(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-xs transition-all text-xs min-h-[46px] flex items-center justify-center gap-2"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>أؤكد التزامي بتقديم هذه المساعدة</span>
                  </button>
                ) : (
                  <form onSubmit={handleCommitSubmit} className="space-y-3 bg-slate-800 p-3.5 rounded-xl border border-slate-700">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-200 mb-1">
                        الكمية التي ستوفرها (اختياري):
                      </label>
                      <input
                        type="text"
                        value={pledgedQuantity}
                        onChange={(e) => setPledgedQuantity(e.target.value)}
                        placeholder="مثال: سأوفر 30 طرد غذائي / 15 بطانية"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-200 mb-1">
                        موعد التسليم المتوقع (اختياري):
                      </label>
                      <input
                        type="text"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        placeholder="مثال: يوم السبت القادم"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-200 mb-1">
                        ملاحظات للتنسيق (اختياري):
                      </label>
                      <textarea
                        rows={2}
                        value={donorNotes}
                        onChange={(e) => setDonorNotes(e.target.value)}
                        placeholder="مثال: سنقوم بنقل المساعدات بسيارتنا إلى مقركم"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPledgeForm(false)}
                        className="flex-1 px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl text-xs min-h-[44px]"
                      >
                        تراجع
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs text-xs min-h-[44px] flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isSubmitting ? 'جاري التأكيد...' : 'تأكيد التكفل الآن'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Bottom Drawer Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs min-h-[44px]"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
