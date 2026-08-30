import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { 
  HelpingHand, 
  Gift, 
  AlertCircle, 
  UserCheck,
  Check,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const SignupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle, currentUser, isProfileComplete, role: userRole } = useAuth();
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();

  const [role, setRole] = useState(searchParams.get('role') === 'donor' ? 'donor' : 'recipient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      if (!isProfileComplete) {
        navigate('/complete-profile');
      } else if (userRole) {
        navigate(userRole === 'recipient' ? '/dashboard' : '/donor');
      }
    }
  }, [currentUser, isProfileComplete, userRole, navigate]);

  const handleGoogleSignup = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle(role);
      if (res.needsCompletion) {
        navigate('/complete-profile');
      } else {
        showSuccess('تم تسجيل الدخول بحساب Google!');
        navigate(res.role === 'recipient' ? '/dashboard' : '/donor');
      }
    } catch (err) {
      console.error("Google sign up error:", err);
      setError(err.message || 'فشل الاتصال بحساب Google. يرجى المحاولة مرة أخرى.');
      showError('فشل تسجيل الدخول بحساب Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden space-y-6 p-7 sm:p-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 ring-4 ring-teal-50 mb-1">
            <UserCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t('signupTitle')}</h1>
          <p className="text-xs text-slate-500">
            {t('signupSubtitle')}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selection Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase text-slate-700">
            {t('chooseAccountRole')}
          </label>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => setRole('recipient')}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all text-right rtl:text-right ${
                role === 'recipient'
                  ? 'border-amber-500 bg-amber-50/90 text-amber-950 ring-2 ring-amber-400 font-bold shadow-md'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <HelpingHand className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold block">{t('iNeedHelpCTA')}</span>
                  <span className="text-xs text-slate-500 font-normal">{t('roleNeedHelpSub')}</span>
                </div>
              </div>
              {role === 'recipient' && (
                <div className="bg-amber-500 text-white p-1 rounded-full">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setRole('donor')}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all text-right rtl:text-right ${
                role === 'donor'
                  ? 'border-teal-500 bg-teal-50/90 text-teal-950 ring-2 ring-teal-400 font-bold shadow-md'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold block">{t('iWantToHelpCTA')}</span>
                  <span className="text-xs text-slate-500 font-normal">{t('roleWantHelpSub')}</span>
                </div>
              </div>
              {role === 'donor' && (
                <div className="bg-teal-600 text-white p-1 rounded-full">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Primary Google Auth CTA */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-4 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 min-h-[48px]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.14C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.29C.47 8.22 0 10.05 0 12s.47 3.78 1.29 5.41l3.99-3.14z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l3.99 3.14c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{isSubmitting ? '...' : t('googleSignUpBtn')}</span>
          </button>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-500 text-[11px] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{t('googleAuthNotice')}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            {t('alreadyRegistered')}{' '}
            <Link to="/login" className="text-teal-600 font-bold hover:underline">
              {t('logIn')}
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
