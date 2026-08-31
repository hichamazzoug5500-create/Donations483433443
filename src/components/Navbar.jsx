import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  Map as MapIcon, 
  ShieldCheck, 
  Building2, 
  PlusCircle,
  User,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import NotificationBell from './NotificationBell';
import PostNeedModal from './PostNeedModal';

export default function Navbar() {
  const { currentUser, userProfile, logout, isSuperAdmin } = useAuth();
  const { lang, toggleLanguage, isRtl } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPostModal, setShowPostModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const isCurrent = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserDropdown(false);
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-4xl mx-auto px-3 sm:px-6">
          <div className="flex justify-between items-center h-14">
            
            {/* Brand Logo & Links */}
            <div className="flex items-center gap-3 sm:gap-6">
              <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-extrabold text-xs shadow-2xs">
                  {lang === 'ar' ? 'أمل' : 'HL'}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    {isRtl ? 'منظومة الإغاثة' : 'Relief Network'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-900 rounded-md hidden xs:inline">
                    🇩🇿
                  </span>
                </div>
              </Link>

              {/* Desktop Direct Links */}
              {currentUser && (
                <nav className="hidden md:flex items-center gap-1 rtl:pr-3 rtl:border-r ltr:pl-3 ltr:border-l border-slate-200">
                  <Link
                    to="/dashboard"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      isCurrent('/dashboard')
                        ? 'bg-emerald-50 text-emerald-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {isRtl ? 'الرئيسية' : 'Feed'}
                  </Link>

                  <Link
                    to="/map"
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      isCurrent('/map')
                        ? 'bg-emerald-50 text-emerald-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {isRtl ? 'الخريطة' : 'Map'}
                  </Link>

                  {isSuperAdmin && (
                    <Link
                      to="/admin"
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        isCurrent('/admin')
                          ? 'bg-purple-50 text-purple-900'
                          : 'text-purple-700 hover:bg-purple-50'
                      }`}
                    >
                      {isRtl ? 'الإدارة' : 'Admin'}
                    </Link>
                  )}
                </nav>
              )}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* In-App Alerts Bell */}
              {currentUser && (
                <NotificationBell onSelectNeed={(id) => navigate(`/dashboard`)} />
              )}

              {/* Language Switch */}
              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition"
              >
                {lang === 'ar' ? 'EN' : 'عربي'}
              </button>

              {/* User Profile Avatar & Dropdown */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-1.5 p-1 pl-2 rtl:pl-1 rtl:pr-2 rounded-xl hover:bg-slate-50 transition border border-slate-200"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                      {userProfile?.displayName ? userProfile.displayName[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[100px] truncate">
                      {userProfile?.displayName || userProfile?.branchName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 animate-in fade-in">
                      <div className="px-2 py-2 mb-2 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{userProfile?.displayName}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isSuperAdmin ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isSuperAdmin ? 'Admin' : 'Branch'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{userProfile?.branchName || userProfile?.email}</p>
                      </div>

                      {isSuperAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserDropdown(false)}
                          className="w-full text-right rtl:text-right ltr:text-left px-2 py-2 text-xs font-bold text-purple-800 hover:bg-purple-50 rounded-xl flex items-center gap-2 transition"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>{isRtl ? 'لوحة التحكم الإدارية' : 'Admin Hub'}</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-right rtl:text-right ltr:text-left px-2 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{isRtl ? 'تسجيل الخروج' : 'Log Out'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition"
                >
                  {isRtl ? 'دخول' : 'Sign In'}
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Bar */}
      {currentUser && (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 md:hidden shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="flex justify-around items-center h-14 px-2 max-w-md mx-auto">
            
            <Link
              to="/dashboard"
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition ${
                isCurrent('/dashboard') ? 'text-emerald-800' : 'text-slate-400'
              }`}
            >
              <Building2 className="w-5 h-5 mb-0.5" />
              <span>{isRtl ? 'الرئيسية' : 'Feed'}</span>
            </Link>

            {/* Elevated Center 1-Tap Emergency Post */}
            <button
              onClick={() => setShowPostModal(true)}
              className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold text-emerald-800 active:scale-95 transition"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center -mt-5 shadow-md border-2 border-white">
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="mt-0.5">{isRtl ? 'طلب مساعدة' : 'Post'}</span>
            </button>

            <Link
              to="/map"
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition ${
                isCurrent('/map') ? 'text-emerald-800' : 'text-slate-400'
              }`}
            >
              <MapIcon className="w-5 h-5 mb-0.5" />
              <span>{isRtl ? 'الخريطة' : 'Map'}</span>
            </Link>

            {isSuperAdmin && (
              <Link
                to="/admin"
                className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition ${
                  isCurrent('/admin') ? 'text-purple-700' : 'text-slate-400'
                }`}
              >
                <ShieldCheck className="w-5 h-5 mb-0.5" />
                <span>{isRtl ? 'الإدارة' : 'Admin'}</span>
              </Link>
            )}
          </div>
        </nav>
      )}

      {/* Post Need Modal */}
      {showPostModal && (
        <PostNeedModal
          isOpen={showPostModal}
          onClose={() => setShowPostModal(false)}
        />
      )}
    </>
  );
}

export { Navbar };
