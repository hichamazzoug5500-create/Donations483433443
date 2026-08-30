import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, currentUser, isProfileComplete, role: userRole } = useAuth();
  const { isRTL } = useLanguage();
  const { showSuccess, showError } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      if (!isProfileComplete) {
        navigate('/complete-profile', { replace: true });
      } else if (userRole) {
        navigate(userRole === 'recipient' ? '/dashboard' : '/donor', { replace: true });
      }
    }
  }, [currentUser, isProfileComplete, userRole, navigate]);

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (res.needsCompletion) {
        navigate('/complete-profile');
      } else {
        showSuccess('مرحباً بك مجدداً!');
        navigate(res.role === 'recipient' ? '/dashboard' : '/donor');
      }
    } catch (err) {
      console.error("Google sign in error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('يرجى إضافة هذا النطاق في قائمة Authorized Domains في إعدادات Firebase Authentication.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'تعذر تسجيل الدخول بحساب Google.');
      }
      showError('تعذر تسجيل الدخول.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 space-y-6 text-center">
        
        {/* Clean Civic Header */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold text-lg flex items-center justify-center mx-auto border border-emerald-100">
            أمل
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            تسجيل الدخول إلى المنصة
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            شبكة التكافل الخيري والإنساني في الجزائر لربط الجمعيات بالمتبرعين مباشرة
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2 text-right">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Primary Google Button */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-3 transition-all min-h-[46px]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.14C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.29C.47 8.22 0 10.05 0 12s.47 3.78 1.29 5.41l3.99-3.14z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l3.99 3.14c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{isSubmitting ? 'جاري الاتصال...' : 'الدخول عبر حساب Google'}</span>
          </button>
          
          <p className="text-[11px] text-slate-400">
            يتم التحقق من الحساب تلقائياً وبأمان عبر Google.
          </p>
        </div>

      </div>
    </div>
  );
};
