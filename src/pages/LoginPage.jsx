import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, AlertCircle, Building2, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { DEMO_USERS } from '../data/mockReliefData';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithGoogle, loginDemoAccount, currentUser, userProfile, authError } = useAuth();
  const { isRtl, t } = useLanguage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser && userProfile?.isProfileComplete) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, userProfile, navigate]);

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        navigate('/dashboard');
      } else if (res.profile?.isUnregistered) {
        setError(isRtl ? 'هذا الحساب غير مسجل في المنظومة. يرجى التواصل مع مسؤول المنظمة لإضافتك.' : 'This account is not pre-registered. Please contact your organization administrator.');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Error signing in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSelect = (emailKey) => {
    loginDemoAccount(emailKey);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6 text-center animate-in fade-in zoom-in-95">
        
        {/* Brand Icon & Heading */}
        <div className="space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
            {isRtl ? 'إغاثة' : 'RC'}
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isRtl ? 'تسجيل الدخول لمنظومة الإغاثة' : 'Sign In to Relief Network'}
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {isRtl 
              ? 'المنصة الداخلية المخصصة لمنسقي فروع الهلال الأحمر والجمعيات الخيرية المعتمدة في الجزائر.' 
              : 'Internal operational network for Red Crescent and registered humanitarian charity branches.'}
          </p>
        </div>

        {(error || authError) && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 p-4 rounded-2xl text-xs font-bold flex items-start gap-2 text-right">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error || authError}</span>
          </div>
        )}

        {/* 1-Click Primary Google Button */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.14C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.29C.47 8.22 0 10.05 0 12s.47 3.78 1.29 5.41l3.99-3.14z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l3.99 3.14c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{isSubmitting ? (isRtl ? 'جاري الاتصال...' : 'Connecting...') : (isRtl ? 'المتابعة عبر حساب Google المعتمد' : 'Sign In with Authorized Google Account')}</span>
          </button>
          
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
            🔒 {isRtl ? 'يتم إنشاء الحسابات مسبقاً وتعيين الصلاحيات من قِبل مسؤول المنظمة فقط.' : 'Accounts and branch permissions are pre-configured by the Organization Administrator.'}
          </div>
        </div>

        {/* Quick Demo Access Roles */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
            {isRtl ? '⚡ تجربة فورية مباشرة (اختر أحد الفروع المعتمدة):' : '⚡ Instant Demo Access (Select a Branch):'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right">
            {Object.entries(DEMO_USERS).map(([emailKey, u]) => (
              <button
                key={emailKey}
                onClick={() => handleDemoSelect(emailKey)}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/60 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-800 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {u.displayName}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    u.role === 'super_admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {u.role === 'super_admin' ? 'Admin' : 'Branch'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 truncate block">
                  📍 {u.branchName}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export { LoginPage };
