import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, AlertCircle, Building2, User } from 'lucide-react';
import { DEMO_USERS } from '../data/mockReliefData';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithGoogle, loginDemoAccount, currentUser, userProfile, authError } = useAuth();
  const { isRtl } = useLanguage();

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
        setError(isRtl ? 'هذا الحساب غير مسجل مسبقاً في المنظومة. يرجى التواصل مع مسؤول المنظمة لإضافتك.' : 'This account is not pre-registered. Please contact your organization administrator.');
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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-lg p-8 space-y-6 text-center animate-in fade-in zoom-in-95">
        
        {/* Brand Icon & Heading */}
        <div className="space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-xs">
            {isRtl ? 'أمل' : 'HL'}
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isRtl ? 'تسجيل الدخول لمنظومة الإغاثة' : 'Sign In to Relief Network'}
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {isRtl 
              ? 'المنصة الداخلية المخصصة لمنسقي فروع الهلال الأحمر والجمعيات الخيرية بالجزائر.' 
              : 'Internal platform for Red Crescent coordinators and authorized charity branches.'}
          </p>
        </div>

        {(error || authError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2 text-right">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error || authError}</span>
          </div>
        )}

        {/* 1-Click Primary Google Button */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-xs flex items-center justify-center gap-3 transition-all min-h-[46px]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.14C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.29C.47 8.22 0 10.05 0 12s.47 3.78 1.29 5.41l3.99-3.14z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l3.99 3.14c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{isSubmitting ? (isRtl ? 'جاري الاتصال...' : 'Connecting...') : (isRtl ? 'المتابعة عبر حساب Google المعتمد' : 'Sign In with Google')}</span>
          </button>
          
          <p className="text-[11px] text-slate-400">
            {isRtl ? 'يتم التحقق من الحسابات مسبقاً وتعيين الصلاحيات من قِبل مسؤول المنظمة.' : 'Branch coordinator accounts are pre-registered by the administrator.'}
          </p>
        </div>

        {/* Quick Demo Access Roles */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <p className="text-xs font-bold text-slate-600">
            {isRtl ? '⚡ تجربة فورية مباشرة (اختر أحد الفروع التجريبية):' : '⚡ Instant Demo Access (Select a Branch):'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right">
            {Object.entries(DEMO_USERS).map(([emailKey, u]) => (
              <button
                key={emailKey}
                onClick={() => handleDemoSelect(emailKey)}
                className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-xs text-slate-900 truncate">
                    {u.displayName}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    u.role === 'super_admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-emerald-100 text-emerald-800'
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
