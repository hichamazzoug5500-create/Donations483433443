import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  HeartHandshake, 
  LogOut, 
  Menu, 
  X, 
  PlusCircle, 
  Building2,
  Globe,
  Home,
  LayoutGrid,
  LogIn
} from 'lucide-react';

export const Navbar = ({ onOpenPostModal }) => {
  const { currentUser, userProfile, logout, role } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                أمل
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  منصة أمل الجزائر
                </span>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  شبكة التكافل الخيري والإنساني
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className={`text-xs font-bold transition-colors ${location.pathname === '/' ? 'text-emerald-800' : 'text-slate-600 hover:text-emerald-800'}`}
              >
                الرئيسية
              </Link>

              {currentUser && (
                <>
                  {role === 'recipient' ? (
                    <Link 
                      to="/dashboard" 
                      className={`text-xs font-bold transition-colors ${location.pathname === '/dashboard' ? 'text-emerald-800' : 'text-slate-600 hover:text-emerald-800'}`}
                    >
                      لوحة قيادة الجمعية
                    </Link>
                  ) : (
                    <Link 
                      to="/donor" 
                      className={`text-xs font-bold transition-colors ${location.pathname === '/donor' ? 'text-emerald-800' : 'text-slate-600 hover:text-emerald-800'}`}
                    >
                      تصفح الاحتياجات
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              {currentUser ? (
                <div className="flex items-center gap-3">
                  {role === 'recipient' && onOpenPostModal && (
                    <button
                      onClick={onOpenPostModal}
                      className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition-all active:scale-95"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>إضافة طلب مساعدة</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 flex items-center justify-end gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{userProfile?.orgName || 'الجمعية'}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        role === 'recipient' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {role === 'recipient' ? 'جمعية محتاجة' : 'جهة متبرعة'}
                      </span>
                    </div>

                    <button
                      onClick={handleLogout}
                      title="تسجيل الخروج"
                      className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>الدخول بحساب Google</span>
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-xs font-bold"
              >
                {lang === 'ar' ? 'EN' : 'عربي'}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 rounded-lg hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-800"
            >
              الرئيسية
            </Link>

            {currentUser ? (
              <>
                {role === 'recipient' ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-bold text-slate-800"
                  >
                    لوحة قيادة الجمعية
                  </Link>
                ) : (
                  <Link
                    to="/donor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-bold text-slate-800"
                  >
                    تصفح الاحتياجات
                  </Link>
                )}

                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-slate-800">{userProfile?.orgName}</p>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-slate-200">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg"
                >
                  الدخول بحساب Google
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile Bottom Thumb Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 md:hidden flex justify-around items-center h-14 px-2 shadow-md">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-full py-1 text-[11px] font-bold ${
            location.pathname === '/' ? 'text-emerald-800' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>الرئيسية</span>
        </Link>

        {currentUser ? (
          role === 'recipient' ? (
            <>
              <Link
                to="/dashboard"
                className={`flex flex-col items-center justify-center w-full py-1 text-[11px] font-bold ${
                  location.pathname === '/dashboard' ? 'text-emerald-800' : 'text-slate-500'
                }`}
              >
                <LayoutGrid className="w-4 h-4 mb-0.5" />
                <span>لوحتي</span>
              </Link>

              {onOpenPostModal && (
                <button
                  onClick={onOpenPostModal}
                  className="flex flex-col items-center justify-center w-full py-1 text-[11px] font-bold text-emerald-800"
                >
                  <PlusCircle className="w-5 h-5 mb-0.5" />
                  <span>طلب مساعدة</span>
                </button>
              )}
            </>
          ) : (
            <Link
              to="/donor"
              className={`flex flex-col items-center justify-center w-full py-1 text-[11px] font-bold ${
                location.pathname === '/donor' ? 'text-emerald-800' : 'text-slate-500'
              }`}
            >
              <LayoutGrid className="w-4 h-4 mb-0.5" />
              <span>الاحتياجات</span>
            </Link>
          )
        ) : (
          <Link
            to="/login"
            className={`flex flex-col items-center justify-center w-full py-1 text-[11px] font-bold ${
              location.pathname === '/login' ? 'text-emerald-800' : 'text-slate-500'
            }`}
          >
            <LogIn className="w-4 h-4 mb-0.5" />
            <span>دخول</span>
          </Link>
        )}
      </div>
    </>
  );
};
