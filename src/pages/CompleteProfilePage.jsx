import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { 
  Building2, 
  Phone, 
  HelpingHand, 
  Gift, 
  AlertCircle, 
  Check,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';
import { sanitizePhoneInput, isValidAlgerianPhone } from '../utils/phoneUtils';

export const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, isProfileComplete, saveUserProfile } = useAuth();
  const { t, isRTL, lang } = useLanguage();
  const { showSuccess, showError } = useToast();

  const [role, setRole] = useState(userProfile?.role || 'donor');
  const [orgName, setOrgName] = useState(userProfile?.orgName || currentUser?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [city, setCity] = useState(userProfile?.city || (isRTL ? 'الجزائر العاصمة' : 'Alger'));
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If already complete, redirect to their role dashboard
  useEffect(() => {
    if (isProfileComplete && userProfile?.role) {
      navigate(userProfile.role === 'recipient' ? '/dashboard' : '/donor', { replace: true });
    }
  }, [isProfileComplete, userProfile, navigate]);

  const handlePhoneChange = (e) => {
    const sanitized = sanitizePhoneInput(e.target.value);
    setPhone(sanitized);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!orgName.trim()) {
      setError(t('orgOrDonorNameLabel'));
      return;
    }
    if (!phone.trim() || !isValidAlgerianPhone(phone)) {
      setError(isRTL ? 'يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0550123456 أو 0661987654)' : 'Please enter a valid Algerian phone number (e.g. 0550123456)');
      return;
    }
    if (!city.trim()) {
      setError(t('wilayaLabel'));
      return;
    }

    setIsSubmitting(true);
    try {
      await saveUserProfile({
        orgName: orgName.trim(),
        role,
        phone: phone.trim(),
        city: city.trim(),
        notes: ''
      });
      showSuccess(isRTL ? 'تم إعداد الحساب بنجاح! مرحباً بك في المنصة.' : 'Profile setup completed! Welcome to the platform.');
      navigate(role === 'recipient' ? '/dashboard' : '/donor', { replace: true });
    } catch (err) {
      console.error("Save profile error:", err);
      setError(err.message || 'Error saving profile');
      showError('Error saving profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 pb-safe-nav">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="space-y-1 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('completeProfileTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('completeProfileSubtitle')}
          </p>
        </div>

        {/* Verified Google Account Bar */}
        {currentUser && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
            {currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Avatar" 
                className="w-9 h-9 rounded-full border border-slate-200 shrink-0" 
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-sm flex items-center justify-center shrink-0">
                {(currentUser.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <span className="text-[11px] text-slate-400 block font-medium">
                {t('verifiedGoogleEmail')}
              </span>
              <span className="text-xs font-bold text-slate-800 truncate block dir-ltr text-left rtl:text-right">
                {currentUser.email}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Choice */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t('activityTypeLabel')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('donor')}
                className={`p-3.5 rounded-xl border flex flex-col items-start gap-1 transition-all text-right rtl:text-right ltr:text-left ${
                  role === 'donor'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-600 font-bold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold">{t('roleDonorTitle')}</span>
                  </div>
                  {role === 'donor' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <span className="text-[10px] text-slate-500 font-normal">{t('roleDonorSubtitle')}</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('recipient')}
                className={`p-3.5 rounded-xl border flex flex-col items-start gap-1 transition-all text-right rtl:text-right ltr:text-left ${
                  role === 'recipient'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-600 font-bold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    <HelpingHand className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold">{t('roleRecipientTitle')}</span>
                  </div>
                  {role === 'recipient' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <span className="text-[10px] text-slate-500 font-normal">{t('roleRecipientSubtitle')}</span>
              </button>
            </div>
          </div>

          {/* Org Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('orgOrDonorNameLabel')}
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder={t('orgOrDonorNamePlaceholder')}
                className="w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>

          {/* Phone & Wilaya */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('contactPhoneLabel')}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="0550 12 34 56"
                  className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 outline-none dir-ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('wilayaLabel')}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 outline-none bg-white font-medium min-h-[42px]"
              >
                {ALGERIA_WILAYAS.map((w) => (
                  <option key={w.code} value={isRTL ? w.nameAr : w.nameEn}>
                    {w.code} - {isRTL ? w.nameAr : w.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold text-sm py-3.5 rounded-xl shadow transition-all min-h-[46px] mt-2 flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? t('savingBtn') : t('saveAndEnterBtn')}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

      </div>
    </div>
  );
};
