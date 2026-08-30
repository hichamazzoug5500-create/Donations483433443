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
  Package,
  MapPin,
  HelpCircle,
  Sparkles
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
      {/* Rich Civic Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Emblem & Name */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                أمل
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-slate-900 tracking-tight">
                    أمل الجزائر
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-900 rounded">
                    تكافل وطني
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  منصة التنسيق المباشر بين الجمعيات والمحسنين
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              <Link 
                to="/" 
                className={`text-xs font-bold transition-colors ${isCurrent('/') ? 'text-emerald-800 font-extrabold' : 'text-slate-600 hover:text-emerald-800'}`}
              >
                الرئيسية
              </Link>

              <a 
                href="#needs-feed" 
                className="text-xs font-bold text-slate-600 hover:text-emerald-800 transition-colors"
              >
                الاحتياجات المفتوحة
              </a>

              <a 
                href="#how-it-works" 
                className="text-xs font-bold text-slate-600 hover:text-emerald-800 transition-colors"
              >
                كيف تعمل المنصة؟
              </a>

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
                      التزاماتي بالمساعدة
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Right Side Header Controls */}
            <div className="flex items-center gap-2.5">
              
              {/* Post Need Button */}
              <button
                onClick={() => {
                  if (!currentUser) {
                    navigate('/login');
                  } else if (onOpenPostModal) {
                    onOpenPostModal();
                  } else {
                    navigate('/dashboard');
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all min-h-[38px]"
              >
                <PlusCircle className="w-4 h-4 text-emerald-300" />
                <span>أنشر طلب مساعدة</span>
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition-colors min-h-[36px]"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              {/* User Account / Google Sign-in */}
              {currentUser ? (
                <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
                  <Link
                    to={role === 'recipient' ? '/dashboard' : '/donor'}
                    className="flex items-center gap-2 p-1 pl-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {userProfile?.orgName ? userProfile.orgName[0] : 'U'}
                    </div>
                    <div className="text-right hidden md:block">
                      <span className="text-xs font-bold text-slate-900 block truncate max-w-[120px]">
                        {userProfile?.orgName || 'حسابي'}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold block">
                        {role === 'recipient' ? 'جمعية خيرية' : 'محسن متبرع'}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="تسجيل الخروج"
                    className="p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 min-h-[36px]"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>دخول Google</span>
                </Link>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* Clean Bottom Tab Navigation for Mobile Devices */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex justify-around items-center h-14 px-1 max-w-md mx-auto">
          
          {/* Tab 1: Home */}
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

          {/* Tab 3: Post Need */}
          <button
            onClick={() => {
              if (!currentUser) {
                navigate('/login');
              } else if (onOpenPostModal) {
                onOpenPostModal();
              } else {
                navigate('/dashboard');
              }
            }}
            className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold text-emerald-800 active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center -mt-4 shadow-md border-2 border-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="mt-0.5">طلب مساعدة</span>
          </button>

          {/* Tab 4: Dashboard / Profile */}
          {currentUser ? (
            <Link
              to={role === 'recipient' ? '/dashboard' : '/donor'}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
                isCurrent('/dashboard') || isCurrent('/donor') ? 'text-emerald-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid className="w-5 h-5 mb-0.5" />
              <span>{role === 'recipient' ? 'لوحتي' : 'التزاماتي'}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-colors ${
                isCurrent('/login') ? 'text-emerald-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-5 h-5 mb-0.5" />
              <span>دخول</span>
            </Link>
          )}

        </div>
      </nav>
    </>
  );
};
