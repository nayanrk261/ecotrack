import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { NAV_LINKS, ROUTES } from '../lib/constants';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { locale, t, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setIsOpen(false);
    toast.success(locale === 'en' ? 'Signed out successfully' : 'सफलतापूर्वक साइन आउट किया गया');
  };

  // Close dropdown on click outside without blocking overlay
  useEffect(() => {
    if (!dropdownOpen) return;
    const closeDropdown = () => setDropdownOpen(false);
    
    const timer = setTimeout(() => {
      document.addEventListener('click', closeDropdown);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', closeDropdown);
    };
  }, [dropdownOpen]);

  const handleToggleLanguage = () => {
    toggleLanguage();
  };

  const langToggleBtn = (
    <button
      onClick={handleToggleLanguage}
      className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 py-1.5 px-3 rounded-full cursor-pointer text-xs font-bold text-zinc-300 transition-all active:scale-[0.98] select-none"
      aria-label="Change Language / भाषा बदलें"
    >
      <span>🇮🇳</span>
      <span>{locale === 'en' ? 'EN / हिं' : 'हिं / EN'}</span>
    </button>
  );

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to={ROUTES.home} className="navbar-logo" onClick={() => setIsOpen(false)}>
          <div className="logo-icon-wrapper">
            <Leaf size={22} />
          </div>
          <span className="logo-text">EcoTrack</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links-desktop">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${
                location.pathname === link.path ? 'nav-link-active' : ''
              }`}
            >
              {t(link.label.toLowerCase() as 'home' | 'calculator' | 'dashboard' | 'actions' | 'insights' | 'learn')}
            </Link>
          ))}

          {/* Language Toggle */}
          <div className="ml-2 flex items-center">
            {langToggleBtn}
          </div>

          {/* Auth State Button */}
          {user ? (
            <div className="relative ml-4">
              <button
                className="flex items-center gap-2 bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 py-1.5 pl-2 pr-3 rounded-full cursor-pointer transition-all duration-200"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${user.avatarBg} flex items-center justify-center font-bold text-sm shadow-sm`}>
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-sm font-semibold max-w-[100px] truncate text-zinc-100">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-zinc-900 p-2 shadow-2xl z-20">
                  <div className="px-3 py-2 border-b border-zinc-900 mb-1.5">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Account</p>
                    <p className="text-sm font-bold text-white truncate mt-0.5">{user.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer transition-all border-none text-left"
                  >
                    <LogOut size={16} />
                    {t('signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={ROUTES.login}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-slate-950 text-sm font-bold rounded-xl transition-all shadow-md shadow-green-500/5 hover:shadow-green-500/15 text-center text-decoration-none"
            >
              {t('signIn')}
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="mobile-menu bg-zinc-950 border-t border-zinc-900">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-menu-link ${
                location.pathname === link.path ? 'nav-link-active' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {t(link.label.toLowerCase() as 'home' | 'calculator' | 'dashboard' | 'actions' | 'insights' | 'learn')}
            </Link>
          ))}

          {/* Mobile Language Toggle */}
          <div className="px-4 py-3 border-t border-zinc-900 flex justify-between items-center">
            <span className="text-sm font-bold text-zinc-400">{locale === 'en' ? 'Language' : 'भाषा'}</span>
            {langToggleBtn}
          </div>

          {/* Mobile Auth options */}
          <div className="mt-2 pt-4 border-t border-zinc-900 px-4">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${user.avatarBg} flex items-center justify-center font-bold text-base shadow-sm`}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-rose-400 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 rounded-xl cursor-pointer transition-all"
                >
                  <LogOut size={16} />
                  {t('signOut')}
                </button>
              </div>
            ) : (
              <Link
                to={ROUTES.login}
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-slate-950 font-bold rounded-xl transition-all shadow-md block text-center text-decoration-none"
              >
                {t('signIn')}
              </Link>
            )}
          </div>
        </div>
      )}

    </nav>
  );
}
