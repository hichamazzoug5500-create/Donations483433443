import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  AlertCircle, 
  Lock, 
  User, 
  KeyRound, 
  ArrowRight, 
  ArrowLeft,
  Eye,
  EyeOff,
  Building2
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithEmail, currentUser, userProfile, authError } = useAuth();
  const { isRtl } = useLanguage();

  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('admin123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError(isRtl ? 'يرجى إدخال اسم المستخدم وكلمة المرور' : 'Please enter identifier and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithEmail(identifier, password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || (isRtl ? 'تعذر تسجيل الدخول. يرجى التحقق من البيانات.' : 'Login failed. Please check credentials.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
        
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white font-black text-xl flex items-center justify-center mx-auto shadow-xs">
            {isRtl ? 'أمل' : 'HL'}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isRtl ? 'تسجيل الدخول للمنظومة' : 'Staff & Admin Sign In'}
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {isRtl 
              ? 'المنصة الداخلية الخاصة بإدارة وتنسيق الإغاثة بين الجمعيات.' 
              : 'Authorized inter-branch disaster coordination network.'}
          </p>
        </div>

        {/* Error Notice */}
        {(error || authError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold flex items-start gap-2 text-right animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error || authError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Identifier (Username / Email) */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              {isRtl ? 'اسم المستخدم أو البريد الإلكتروني' : 'Username or Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto pointer-events-none" />
              <input
                required
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isRtl ? 'مثال: admin أو blida@hopelink.dz' : 'e.g. admin or blida@hopelink.dz'}
                className="w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-700 outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              {isRtl ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto pointer-events-none" />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 rtl:pr-9 rtl:pl-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-700 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rtl:left-3 rtl:right-auto text-slate-400 hover:text-slate-600 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition min-h-[44px]"
          >
            <span>{isSubmitting ? (isRtl ? 'جاري التحقق...' : 'Signing in...') : (isRtl ? 'دخول للمنظومة' : 'Sign In')}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </form>

        {/* Admin Credential Notice */}
        <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-[11px] text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{isRtl ? 'بيانات الدخول للمشرف (Admin):' : 'Admin Login Credentials:'}</span>
          </div>
          <p className="text-slate-600">
            {isRtl ? 'المستخدم:' : 'User:'} <code className="font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-emerald-200">admin</code>
            {'  '}•{'  '}
            {isRtl ? 'كلمة المرور:' : 'Password:'} <code className="font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-emerald-200">admin123456</code>
          </p>
        </div>

      </div>
    </div>
  );
}

export { LoginPage };
