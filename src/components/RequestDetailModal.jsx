import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Building2, 
  PhoneCall, 
  CheckCircle2, 
  Copy, 
  HeartHandshake, 
  PackageCheck, 
  AlertCircle,
  Sparkles,
  PieChart,
  Check
} from 'lucide-react';
import { MapView } from './MapView';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const RequestDetailModal = ({ request, onClose }) => {
  const { commitToRequest, cancelCommitment } = useData();
  const { userProfile } = useAuth();
  const { t, isRTL } = useLanguage();

  const [copied, setCopied] = useState(false);
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [commitmentType, setCommitmentType] = useState('full'); // 'full' or 'partial'
  const [pledgedQuantity, setPledgedQuantity] = useState(request?.quantity || '');
  const [remainingQuantity, setRemainingQuantity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [donorNotes, setDonorNotes] = useState('');
  const [formError, setFormError] = useState('');
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
    setFormError('');

    if (commitmentType === 'partial' && !remainingQuantity.trim()) {
      setFormError(t('remainingQtyLabel'));
      return;
    }

    setIsSubmitting(true);
    try {
      await commitToRequest(request.requestId, {
        commitmentType,
        pledgedQuantity: pledgedQuantity.trim(),
        remainingQuantity: commitmentType === 'partial' ? remainingQuantity.trim() : '',
        deliveryDate: deliveryDate.trim(),
        donorNotes: donorNotes.trim()
      });
      setShowPledgeForm(false);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 4000);
    } catch (err) {
      console.error("Error committing to request:", err);
      setFormError('Error saving commitment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelCommitment = async () => {
    if (window.confirm(t('confirmCancelCommitment'))) {
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
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                request.status === 'fulfilled'
                  ? 'bg-slate-700 text-slate-300'
                  : request.status === 'in_progress'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-600 text-white'
              }`}>
                {request.status === 'fulfilled' 
                  ? t('statusFulfilled')
                  : request.status === 'in_progress' 
                  ? t('statusInProgress') 
                  : t('statusOpen')}
              </span>

              {request.remainingQuantity && (
                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {t('partialAidBadge')} • {t('remainingNeededTag')} {request.remainingQuantity}
                </span>
              )}
              
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {request.urgency === 'high' ? t('urgencyHigh') : request.urgency === 'medium' ? t('urgencyMedium') : t('urgencyLow')}
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
              {t('detailsOfNeedTitle')}
            </h3>
            <p className="text-slate-800 leading-relaxed whitespace-pre-line text-sm bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {request.needDescription}
            </p>
          </div>

          {/* Scope / Quantity & Remaining Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {request.quantity && (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 block">{t('quantityNeeded')}</span>
                  <span className="text-emerald-950 font-extrabold text-sm sm:text-base">{request.quantity}</span>
                </div>
                <HeartHandshake className="w-6 h-6 text-emerald-600 opacity-60" />
              </div>
            )}

            {request.remainingQuantity && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 block">{t('remainingNeededTag')}</span>
                  <span className="text-amber-950 font-extrabold text-sm sm:text-base">{request.remainingQuantity}</span>
                </div>
                <PieChart className="w-6 h-6 text-amber-600 opacity-60" />
              </div>
            )}
          </div>

          {/* Map Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('dropoffLocationTitle')}</span>
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
                <span>{t('charityPhoneLabel')}</span>
              </span>
              <span className="text-sm font-extrabold text-slate-900 dir-ltr">
                {request.phone || 'N/A'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={copyPhone}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs min-h-[44px] transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? t('copiedPhone') : t('copyPhoneBtn')}</span>
              </button>

              <a
                href={`tel:${request.phone}`}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold rounded-xl text-xs shadow-xs min-h-[44px] transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t('callNow')}</span>
              </a>
            </div>
          </div>

          {/* Mission Commitment Section */}
          <div className="border-t border-slate-200 pt-4">
            
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-xl mb-3 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('pledgeSuccessTitle')}</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  {t('pledgeSuccessMsg')}
                </p>
              </div>
            )}

            {isAlreadyCommittedByMe ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{t('alreadyPledgedBadge')}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md font-bold">
                    {t('statusInProgress')}
                  </span>
                </div>
                
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  {t('alreadyPledgedMsg')}
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleCancelCommitment}
                    disabled={isCancelling}
                    className="text-xs text-red-700 hover:underline font-semibold"
                  >
                    {isCancelling ? '...' : t('cancelCommitmentLink')}
                  </button>
                </div>
              </div>
            ) : request.status === 'fulfilled' ? (
              <div className="bg-slate-100 border border-slate-200 text-slate-700 p-3.5 rounded-xl text-center text-xs font-semibold">
                {t('fulfilledNotice')}
              </div>
            ) : (
              <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t('pledgeSectionHeader')}</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {t('pledgeSectionExpl')}
                  </p>
                </div>

                {!showPledgeForm ? (
                  <button
                    type="button"
                    onClick={() => setShowPledgeForm(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-xs transition-all text-xs min-h-[46px] flex items-center justify-center gap-2"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>{t('confirmPledgeActionBtn')}</span>
                  </button>
                ) : (
                  <form onSubmit={handleCommitSubmit} className="space-y-3.5 bg-slate-800 p-3.5 sm:p-4 rounded-xl border border-slate-700">
                    
                    {formError && (
                      <div className="bg-red-900/50 border border-red-500 text-red-200 p-2.5 rounded-lg text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* 🌟 1. Full vs Partial Commitment Choice 🌟 */}
                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5">
                        {t('commitmentTypeLabel')}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setCommitmentType('full');
                            setPledgedQuantity(request.quantity || 'كامل الطلب');
                          }}
                          className={`p-3 rounded-xl border text-right rtl:text-right ltr:text-left transition-all ${
                            commitmentType === 'full'
                              ? 'border-emerald-400 bg-emerald-950/60 ring-2 ring-emerald-400 text-white'
                              : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{t('fullCommitmentOption')}</span>
                            </span>
                            {commitmentType === 'full' && <Check className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-snug">
                            {t('fullCommitmentDesc')}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCommitmentType('partial')}
                          className={`p-3 rounded-xl border text-right rtl:text-right ltr:text-left transition-all ${
                            commitmentType === 'partial'
                              ? 'border-amber-400 bg-amber-950/60 ring-2 ring-amber-400 text-white'
                              : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs flex items-center gap-1.5">
                              <PieChart className="w-3.5 h-3.5 text-amber-400" />
                              <span>{t('partialCommitmentOption')}</span>
                            </span>
                            {commitmentType === 'partial' && <Check className="w-4 h-4 text-amber-400" />}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-snug">
                            {t('partialCommitmentDesc')}
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Quantity Pledged */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-200 mb-1">
                        {t('pledgedQtyLabel')}
                      </label>
                      <input
                        type="text"
                        value={pledgedQuantity}
                        onChange={(e) => setPledgedQuantity(e.target.value)}
                        placeholder={t('pledgeFormQtyPlaceholder')}
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    {/* Remaining Quantity (If Partial) */}
                    {commitmentType === 'partial' && (
                      <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl space-y-1 animate-in fade-in duration-150">
                        <label className="block text-[11px] font-bold text-amber-300 mb-1">
                          {t('remainingQtyLabel')}
                        </label>
                        <input
                          type="text"
                          required
                          value={remainingQuantity}
                          onChange={(e) => setRemainingQuantity(e.target.value)}
                          placeholder={t('remainingQtyPlaceholder')}
                          className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-amber-500/50 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                        <p className="text-[10px] text-amber-200/80">
                          {t('partialCommitmentDesc')}
                        </p>
                      </div>
                    )}

                    {/* Delivery Date */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-200 mb-1">
                        {t('deliveryDateLabel')}
                      </label>
                      <input
                        type="text"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        placeholder={t('pledgeFormDatePlaceholder')}
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-200 mb-1">
                        {t('donorNotesLabel')}
                      </label>
                      <textarea
                        rows={2}
                        value={donorNotes}
                        onChange={(e) => setDonorNotes(e.target.value)}
                        placeholder={t('pledgeFormNotesPlaceholder')}
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPledgeForm(false)}
                        className="flex-1 px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl text-xs min-h-[44px]"
                      >
                        {t('backBtn')}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs text-xs min-h-[44px] flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isSubmitting ? t('savingBtn') : t('submitPledgeBtn')}</span>
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
            {t('closeModalBtn')}
          </button>
        </div>

      </div>
    </div>
  );
};
