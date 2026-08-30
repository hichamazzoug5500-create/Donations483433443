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
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-start justify-between relative shrink-0">
          <div className="space-y-1 pr-8 rtl:pl-8 rtl:pr-0">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                request.status === 'fulfilled'
                  ? 'bg-slate-700 text-slate-300'
                  : request.status === 'in_progress'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-teal-500 text-white'
              }`}>
                {request.status === 'fulfilled' 
                  ? t('statusFulfilled') 
                  : request.status === 'in_progress' 
                  ? t('statusInProgress') 
                  : t('statusOpen')}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                request.urgency === 'high' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
                {t(request.urgency === 'high' ? 'urgencyHigh' : request.urgency === 'medium' ? 'urgencyMedium' : 'urgencyLow')}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 pt-1">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 shrink-0" />
              <span>{request.orgName}</span>
            </h2>
            <p className="text-slate-300 text-xs flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{request.location?.address || request.location?.city || 'الجزائر'}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-grow">
          
          {/* Description */}
          <div>
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
              {t('needDescLabel')}
            </h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {request.needDescription}
            </p>
          </div>

          {/* Quantity */}
          {request.quantity && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-teal-700 tracking-wider block">{t('quantityNeeded')}</span>
                <span className="text-teal-950 font-bold text-sm sm:text-base">{request.quantity}</span>
              </div>
              <HeartHandshake className="w-7 h-7 text-teal-500 opacity-60" />
            </div>
          )}

          {/* Map Location */}
          <div>
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {request.location?.address || t('clickMapToPick')}
            </h3>
            <div className="h-40 sm:h-48 w-full rounded-xl overflow-hidden border border-slate-200">
              <MapView requests={[request]} selectedRequestId={request.requestId} zoomLevel={13} />
            </div>
          </div>

          {/* STEP 1: Direct Inquiries & Contact Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{t('orgContactInfo')}</h4>
                <p className="text-[11px] text-slate-500">{t('directCallNotice')}</p>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">{t('phoneLabel')}:</span>
                <span className="text-lg font-extrabold text-slate-900 tracking-wide dir-ltr">
                  {request.phone || 'غير متوفر'}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {request.phone && (
                  <>
                    <button
                      type="button"
                      onClick={copyPhone}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs min-h-[42px] transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copied ? t('copied') : t('copyPhone')}</span>
                    </button>
                    <a
                      href={`tel:${request.phone}`}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow min-h-[42px] transition-colors"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{t('callNow')}</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* STEP 2: Mission Acceptance / Commitment Workflow */}
          <div className="border-t border-slate-200 pt-4">
            
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl mb-4 space-y-1 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{t('commitmentSuccessTitle')}</span>
                </div>
                <p className="text-xs text-emerald-700">{t('commitmentSuccessMsg')}</p>
              </div>
            )}

            {isAlreadyCommittedByMe ? (
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{t('youAreCommittedBadge')}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                    نشط
                  </span>
                </div>
                
                <p className="text-xs text-emerald-800">
                  لقد أكدت التزامك بتوفير هذه المساعدة للجمعية. يرجى التواصل معهم هاتفياً للتنسيق والتسليم.
                </p>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleCancelCommitment}
                    disabled={isCancelling}
                    className="text-xs text-red-600 hover:text-red-700 hover:underline font-semibold"
                  >
                    {isCancelling ? t('cancelling') : t('cancelCommitmentBtn')}
                  </button>
                </div>
              </div>
            ) : request.status === 'fulfilled' ? (
              <div className="bg-slate-100 border border-slate-200 text-slate-700 p-4 rounded-xl text-center text-xs font-semibold">
                تم تلبية هذا الاحتياج بالكامل بنجاح. شكراً لجميع المتبرعين.
              </div>
            ) : userRole === 'donor' || !userRole ? (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{t('pledgeSectionTitle')}</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      {t('pledgeSectionDesc')}
                    </p>
                  </div>
                </div>

                {!showPledgeForm ? (
                  <button
                    type="button"
                    onClick={() => setShowPledgeForm(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 min-h-[46px]"
                  >
                    <PackageCheck className="w-5 h-5" />
                    <span>{t('acceptMissionBtn')}</span>
                  </button>
                ) : (
                  <form onSubmit={handleCommitSubmit} className="space-y-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                        <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t('pledgedQtyLabel')}</span>
                      </label>
                      <input
                        type="text"
                        value={pledgedQuantity}
                        onChange={(e) => setPledgedQuantity(e.target.value)}
                        placeholder={t('pledgedQtyPlaceholder')}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-400" />
                        <span>{t('deliveryDateLabel')}</span>
                      </label>
                      <input
                        type="text"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        placeholder={t('deliveryDatePlaceholder')}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('donorNotesLabel')}</span>
                      </label>
                      <textarea
                        rows={2}
                        value={donorNotes}
                        onChange={(e) => setDonorNotes(e.target.value)}
                        placeholder={t('donorNotesPlaceholder')}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPledgeForm(false)}
                        className="flex-1 px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl text-xs min-h-[42px]"
                      >
                        تراجع
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl shadow transition-all active:scale-95 text-xs min-h-[42px] flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isSubmitting ? '...' : t('confirmCommitmentBtn')}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : null}

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-sm min-h-[44px]"
          >
            {t('closeWindow')}
          </button>
        </div>

      </div>
    </div>
  );
};
