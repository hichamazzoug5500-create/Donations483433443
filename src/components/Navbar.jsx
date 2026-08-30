import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  LogOut, 
  Menu, 
  X, 
  PlusCircle, 
  Building2, 
  Globe, 
  Home, 
  LayoutGrid, 
  LogIn,
  HeartHandshake,
  User,
  Package
} from 'lucide-react';

export const Navbar = ({ onOpenPostModal }) => {
  const { currentUser, userProfile, logout, role } = useAuth();
  const { lang, toggleLanguage } = useLanguage();
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

  const isCurrent = (path) => location.pathname === path;

  return (
    <>
      {/* Sleek Top App Bar (52px on mobile, 60px on desktop) */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-13 sm:h-15">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
                أمل
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
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
                className={`text-xs font-bold transition-colors ${isCurrent('/') ? 'text-emerald-800 font-extrabold' : 'text-slate-600 hover:text-emerald-800'}`}
              >
                الرئيسية
              </Link>

              {currentUser && (
                <>
                  {role === 'recipient' ? (
                    <Link 
                      to="/dashboard" 
                      className={`text-xs font-bold transition-colors ${isCurrent('/dashboard') ? 'text-emerald-800 font-extrabold' : 'text-slate-600 hover:text-emerald-800'}`}
                    >
                      لوحة قيادة الجمعية
                    </Link>
                  ) : (
                    <Link 
                      to="/donor" 
                      className={`text-xs font-bold transition-colors ${isCurrent('/donor') ? 'text-emerald-800 font-extrabold' : 'text-slate-600 hover:text-emerald-800'}`}
                    >
                      تصفح الاحتياجات
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Top Right Desktop / Mobile Actions */}
            <div className="flex items-center gap-2">
              
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold border border-slate-200 transition-colors min-h-[34px]"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              {/* Desktop User Status / Auth Button */}
              {currentUser ? (
                <div className="hidden md:flex items-center gap-2.5 pr-2.5 border-r border-slate-200">
                  {role === 'recipient' && onOpenPostModal && (
                    <button
                      onClick={onOpenPostModal}
                      className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition-all"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>إضافة طلب</span>
                    </button>
                  )}

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[140px]">
                      {userProfile?.orgName || 'حسابي'}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      role === 'recipient' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {role === 'recipient' ? 'جمعية' : 'متبرع'}
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
              ) : (
                <Link
                  to="/login"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 min-h-[34px]"
                >
                  <LogIn className="w-3 h-3" />
                  <span>دخول عبر Google</span>
                </Link>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* Native App-Style Bottom Tab Bar (Fixed at bottom on mobile) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 md:hidden shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex justify-around items-center h-14 px-1 max-w-md mx-auto">
          
          {/* Tab 1: Home Feed */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
              isCurrent('/') ? 'text-emerald-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>الرئيسية</span>
          </Link>

          {/* Tab 2: Needs Feed */}
          <Link
            to="/donor"
            className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
              isCurrent('/donor') ? 'text-emerald-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Package className="w-5 h-5 mb-0.5" />
            <span>الاحتياجات</span>
          </Link>

          {/* Tab 3: Post Need Action (Charity or Quick Trigger) */}
          {role === 'recipient' && onOpenPostModal ? (
            <button
              onClick={onOpenPostModal}
              className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold text-amber-600 active:scale-95 transition-transform"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center -mt-3 shadow-md border-2 border-white">
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="mt-0.5">إضافة طلب</span>
            </button>
          ) : null}

          {/* Tab 4: Dashboard / Profile */}
          {currentUser ? (
            <Link
              to={role === 'recipient' ? '/dashboard' : '/donor'}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
                isCurrent('/dashboard') || (isCurrent('/donor') && role === 'donor') ? 'text-emerald-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid className="w-5 h-5 mb-0.5" />
              <span>{role === 'recipient' ? 'لوحة جمعيتي' : 'التزاماتي'}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
                isCurrent('/login') ? 'text-emerald-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-5 h-5 mb-0.5" />
              <span>حسابي</span>
            </Link>
          )}

        </div>
      </nav>
    </>
  );
};
