import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { 
  Building2, 
  Phone, 
  MapPin, 
  HelpingHand, 
  Gift, 
  AlertCircle, 
  UserCheck,
  Check,
  Sparkles
} from 'lucide-react';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';
import { sanitizePhoneInput, isValidAlgerianPhone } from '../utils/phoneUtils';

export const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, isProfileComplete, saveUserProfile } = useAuth();
  const { t, isRTL } = useLanguage();
  const { showSuccess, showError } = useToast();

  const [role, setRole] = useState(userProfile?.role || 'recipient');
  const [orgName, setOrgName] = useState(userProfile?.orgName || userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [city, setCity] = useState(userProfile?.city || 'الجزائر العاصمة');
  const [notes, setNotes] = useState(userProfile?.notes || '');
  
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

    if (!role) {
      setError('يرجى اختيار نوع الحساب أولاً');
      return;
    }
    if (!orgName.trim()) {
      setError('يرجى إدخال اسم الجمعية أو المتبرع');
      return;
    }
    if (!phone.trim() || !isValidAlgerianPhone(phone)) {
      setError('يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0550123456 أو 0661987654)');
      return;
    }
    if (!city.trim()) {
      setError('يرجى اختيار الولاية');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveUserProfile({
        orgName,
        role,
        phone,
        city,
        notes
      });
      showSuccess('تم حفظ بيانات الحساب بنجاح! مرحباً بك في المنصة.');
      navigate(role === 'recipient' ? '/dashboard' : '/donor', { replace: true });
    } catch (err) {
      console.error("Save profile error:", err);
      setError(err.message || 'تعذر حفظ البيانات، يرجى المحاولة مرة أخرى.');
      showError('حدث خطأ أثناء حفظ الملف الشخصي.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden space-y-6 p-6 sm:p-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 ring-4 ring-teal-50/50 mb-1">
            <UserCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t('completeProfileTitle')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {t('completeProfileSubtitle')}
          </p>
        </div>

        {/* User Google Account Tag */}
        {currentUser && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3">
            {currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border border-slate-300 shrink-0" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">
                {(currentUser.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <span className="text-[11px] text-slate-400 block font-medium">
                {t('signedInAsGoogle')}
              </span>
              <span className="text-xs font-bold text-slate-800 truncate block dir-ltr text-right rtl:text-right">
                {currentUser.email}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
              {t('accountTypeLabel')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('recipient')}
                className={`p-4 rounded-2xl border flex flex-col items-start gap-2 transition-all relative text-right rtl:text-right ${
                  role === 'recipient'
                    ? 'border-amber-500 bg-amber-50/80 text-amber-950 ring-2 ring-amber-400 font-bold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                }`}
              >
                {role === 'recipient' && (
                  <div className="absolute top-3 left-3 rtl:right-auto rtl:left-3 bg-amber-500 text-white p-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <HelpingHand className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-bold">{t('iNeedHelpCTA')}</span>
                </div>
                <span className="text-xs text-slate-500 font-normal">{t('roleNeedHelpSub')}</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('donor')}
                className={`p-4 rounded-2xl border flex flex-col items-start gap-2 transition-all relative text-right rtl:text-right ${
                  role === 'donor'
                    ? 'border-teal-500 bg-teal-50/80 text-teal-950 ring-2 ring-teal-400 font-bold shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                }`}
              >
                {role === 'donor' && (
                  <div className="absolute top-3 left-3 rtl:right-auto rtl:left-3 bg-teal-600 text-white p-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-bold">{t('iWantToHelpCTA')}</span>
                </div>
                <span className="text-xs text-slate-500 font-normal">{t('roleWantHelpSub')}</span>
              </button>
            </div>
          </div>

          {/* Org / Individual Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('orgNameLabel')}
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder={t('orgNamePlaceholder')}
                className="w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Phone & Wilaya in Algeria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('phoneLabel')}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="0550 12 34 56"
                  className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 outline-none dir-ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('cityLabel')}
              </label>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                >
                  {ALGERIA_WILAYAS.map((w) => (
                    <option key={w.code} value={isRTL ? w.nameAr : w.nameEn}>
                      {w.code} - {isRTL ? w.nameAr : w.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 min-h-[46px]"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? t('savingProfile') : t('completeProfileBtn')}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
