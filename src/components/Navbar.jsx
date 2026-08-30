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
  Sparkles,
  Building2,
  Globe,
  Home,
  LayoutGrid,
  UserCheck
} from 'lucide-react';

export const Navbar = ({ onOpenPostModal }) => {
  const { currentUser, userProfile, logout, role, isDemoMode, loginDemoRole } = useAuth();
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
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="bg-amber-500 text-white text-[11px] sm:text-xs py-1.5 px-3 text-center font-medium flex items-center justify-center gap-1.5 shadow-inner flex-wrap">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{t('demoMode')}</span>
            <div className="inline-flex items-center gap-1.5">
              <button 
                onClick={() => { loginDemoRole('recipient'); navigate('/dashboard'); }}
                className="bg-amber-700 hover:bg-amber-800 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold"
              >
                {t('asRecipient')}
              </button>
              <button 
                onClick={() => { loginDemoRole('donor'); navigate('/donor'); }}
                className="bg-amber-700 hover:bg-amber-800 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold"
              >
                {t('asDonor')}
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md group-hover:bg-teal-700 transition-colors">
                <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent">
                  {t('brandName')}
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  {t('brandSubtitle')}
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-teal-600 font-semibold' : 'text-slate-600 hover:text-teal-600'}`}
              >
                {t('home')}
              </Link>

              {currentUser && (
                <>
                  {role === 'recipient' && (
                    <Link 
                      to="/dashboard" 
                      className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-teal-600 font-semibold' : 'text-slate-600 hover:text-teal-600'}`}
                    >
                      {t('myRequests')}
                    </Link>
                  )}

                  {role === 'donor' && (
                    <Link 
                      to="/donor" 
                      className={`text-sm font-medium transition-colors ${location.pathname === '/donor' ? 'text-teal-600 font-semibold' : 'text-slate-600 hover:text-teal-600'}`}
                    >
                      {t('browseNeeds')}
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Desktop Action Bar */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors border border-slate-200"
              >
                <Globe className="w-4 h-4 text-teal-600" />
                <span>{lang === 'ar' ? '🇬🇧 English' : '🇩🇿 العربية'}</span>
              </button>

              {currentUser ? (
                <div className="flex items-center gap-3">
                  {role === 'recipient' && onOpenPostModal && (
                    <button
                      onClick={onOpenPostModal}
                      className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition-all active:scale-95"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{t('postNeed')}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2 ltr:pl-3 rtl:pr-3 ltr:border-l rtl:border-r border-slate-200">
                    <div className="text-right rtl:text-left">
                      <div className="text-sm font-semibold text-slate-800 flex items-center justify-end rtl:justify-start gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{userProfile?.orgName || 'الجمعية'}</span>
                      </div>
                      <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        role === 'recipient' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {role === 'recipient' ? t('roleRecipient') : t('roleDonor')}
                      </span>
                    </div>

                    <button
                      onClick={handleLogout}
                      title={t('logOut')}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-slate-700 hover:text-teal-600 px-3 py-2"
                  >
                    {t('logIn')}
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm"
                  >
                    {t('registerOrg')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Header Buttons */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-xs font-bold border border-slate-200"
              >
                {lang === 'ar' ? 'EN' : 'عربي'}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Header Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-700"
            >
              {t('home')}
            </Link>

            {currentUser ? (
              <>
                {role === 'recipient' ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base font-medium text-slate-700"
                  >
                    {t('myRequests')}
                  </Link>
                ) : (
                  <Link
                    to="/donor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base font-medium text-slate-700"
                  >
                    {t('browseNeeds')}
                  </Link>
                )}

                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <p className="text-sm font-bold text-slate-800">{userProfile?.orgName}</p>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 text-slate-700 font-medium rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logOut')}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 bg-slate-100 text-slate-800 font-semibold rounded-xl"
                >
                  {t('logIn')}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 bg-teal-600 text-white font-semibold rounded-xl"
                >
                  {t('registerOrg')}
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Sticky Mobile Bottom Thumb Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 md:hidden flex justify-around items-center h-16 px-2 shadow-lg">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-full py-1 text-[11px] font-bold ${
            location.pathname === '/' ? 'text-teal-600' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>{t('home')}</span>
        </Link>

        {currentUser ? (
          role === 'recipient' ? (
            <>
              <Link
                to="/dashboard"
                className={`flex flex-col items-center justify-center w-full py-1 text-[11px] font-bold ${
                  location.pathname === '/dashboard' ? 'text-teal-600' : 'text-slate-500'
                }`}
              >
                <LayoutGrid className="w-5 h-5 mb-0.5" />
                <span>{t('myRequests')}</span>
              </Link>

              {onOpenPostModal && (
                <button
                  onClick={onOpenPostModal}
                  className="flex flex-col items-center justify-center w-full py-1 text-[11px] font-bold text-amber-600"
                >
                  <PlusCircle className="w-6 h-6 mb-0.5" />
                  <span>{t('postNeed')}</span>
                </button>
              )}
            </>
          ) : (
            <Link
              to="/donor"
              className={`flex flex-col items-center justify-center w-full py-1 text-[11px] font-bold ${
                location.pathname === '/donor' ? 'text-teal-600' : 'text-slate-500'
              }`}
            >
              <LayoutGrid className="w-5 h-5 mb-0.5" />
              <span>{t('browseNeeds')}</span>
            </Link>
          )
        ) : (
          <Link
            to="/login"
            className={`flex flex-col items-center justify-center w-full py-1 text-[11px] font-bold ${
              location.pathname === '/login' ? 'text-teal-600' : 'text-slate-500'
            }`}
          >
            <UserCheck className="w-5 h-5 mb-0.5" />
            <span>{t('logIn')}</span>
          </Link>
        )}
      </div>
    </>
  );
};
