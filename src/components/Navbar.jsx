import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  Globe, 
  Map as MapIcon, 
  ShieldCheck, 
  Building2, 
  PlusCircle,
  ArrowLeftRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import NotificationBell from './NotificationBell';
import PostNeedModal from './PostNeedModal';
import { DEMO_USERS } from '../data/mockReliefData';

export default function Navbar() {
  const { currentUser, userProfile, logout, isSuperAdmin, loginDemoAccount } = useAuth();
  const { lang, toggleLanguage, isRtl, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPostModal, setShowPostModal] = useState(false);
  const [showDemoSwitchMenu, setShowDemoSwitchMenu] = useState(false);

  const isCurrent = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                  {lang === 'ar' ? 'أمل' : 'HL'}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      {isRtl ? 'منصة تنسيق الإغاثة' : 'Relief Coordination'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full hidden sm:inline">
                      {isRtl ? 'بين الجمعيات' : 'Inter-Branch'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                    {isRtl ? 'الهلال الأحمر والجمعيات الإنسانية بالجزائر' : 'Humanitarian Relief Network'}
                  </span>
                </div>
              </Link>

              {/* Desktop Direct Nav Links */}
              {currentUser && (
                <nav className="hidden md:flex items-center gap-2 pr-3 rtl:pr-4 rtl:border-r ltr:pl-4 ltr:border-l border-slate-200">
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      isCurrent('/dashboard')
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-800" />
                    <span>{isRtl ? 'لوحة قيادة الفرع' : 'Branch Dashboard'}</span>
                  </Link>

                  <Link
                    to="/map"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      isCurrent('/map')
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <MapIcon className="w-4 h-4 text-emerald-800" />
                    <span>{isRtl ? 'الخريطة الميدانية' : 'National Map'}</span>
                  </Link>

                  {isSuperAdmin && (
                    <Link
                      to="/admin"
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                        isCurrent('/admin')
                          ? 'bg-purple-50 text-purple-900 border border-purple-200'
                          : 'text-purple-700 hover:bg-purple-50'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      <span>{isRtl ? 'الإدارة العامة' : 'Admin Hub'}</span>
                    </Link>
                  )}
                </nav>
              )}
            </div>

            {/* Right Side Header Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Broadcast Need Button */}
              {currentUser && (
                <button
                  onClick={() => setShowPostModal(true)}
                  className="hidden sm:flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-300" />
                  <span>{isRtl ? 'نشر طلب مساعدة' : 'Post Need'}</span>
                </button>
              )}

              {/* In-App Notifications Bell */}
              {currentUser && (
                <NotificationBell onSelectNeed={(id) => navigate(`/needs/${id}`)} />
              )}

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition"
                title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              {/* User Account / Role Switcher */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDemoSwitchMenu(!showDemoSwitchMenu)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl hover:bg-slate-50 transition border border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {userProfile?.displayName ? userProfile.displayName[0].toUpperCase() : 'U'}
                    </div>
                    <div className="text-right rtl:text-right ltr:text-left hidden lg:block max-w-[130px]">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {userProfile?.displayName}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold block truncate">
                        {userProfile?.branchName || userProfile?.orgName}
                      </span>
                    </div>
                    <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Quick Demo Role Switcher Popup */}
                  {showDemoSwitchMenu && (
                    <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                      <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                        {isRtl ? 'تبديل الحساب التجريبي / الفرع' : 'Switch Demo Branch'}
                      </p>
                      <div className="space-y-1">
                        {Object.entries(DEMO_USERS).map(([emailKey, u]) => (
                          <button
                            key={emailKey}
                            onClick={() => {
                              loginDemoAccount(emailKey);
                              setShowDemoSwitchMenu(false);
                            }}
                            className={`w-full text-right p-2 rounded-xl text-xs transition flex flex-col ${
                              userProfile?.email === u.email 
                                ? 'bg-emerald-50 font-bold text-emerald-900 border border-emerald-200'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="font-bold">{u.displayName}</span>
                            <span className="text-[10px] text-slate-500">{u.branchName}</span>
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full p-2 text-red-700 hover:bg-red-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'تسجيل الخروج' : 'Log Out'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition"
                >
                  {isRtl ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      {currentUser && (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 md:hidden shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="flex justify-around items-center h-14 px-1 max-w-md mx-auto">
            
            <Link
              to="/dashboard"
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition ${
                isCurrent('/dashboard') ? 'text-emerald-800' : 'text-slate-400'
              }`}
            >
              <Building2 className="w-5 h-5 mb-0.5" />
              <span>{isRtl ? 'الرئيسية' : 'Home'}</span>
            </Link>

            <Link
              to="/map"
              className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition ${
                isCurrent('/map') ? 'text-emerald-800' : 'text-slate-400'
              }`}
            >
              <MapIcon className="w-5 h-5 mb-0.5" />
              <span>{isRtl ? 'الخريطة' : 'Map'}</span>
            </Link>

            {/* Broadcast Action Center Button */}
            <button
              onClick={() => setShowPostModal(true)}
              className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold text-emerald-800 active:scale-95 transition"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center -mt-4 shadow-md border-2 border-white">
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="mt-0.5">{isRtl ? 'طلب مساعدة' : 'Post Need'}</span>
            </button>

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

      {/* Broadcast Need Modal */}
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
