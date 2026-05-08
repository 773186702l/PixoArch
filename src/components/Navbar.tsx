import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, User, Globe, Moon, Sun, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../contexts/SettingsContext';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, profile, signOut } = useAuth();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('projects'), path: '/projects' },
    { name: t('team_members'), path: '/team' },
    { name: t('blog'), path: '/blog' },
    { name: t('about'), path: '/about' },
    { name: t('contact'), path: '/contact' },
  ];

  return (
    <nav className="glass-card !rounded-none !bg-transparent !border-none backdrop-blur-md sticky top-0 z-50 border-b border-[var(--glass-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center border border-brand-accent/20">
              <span className="text-xl font-bold text-brand-accent">{settings.siteName.charAt(0)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-primary group-hover:text-brand-accent transition-colors uppercase">
                {settings.siteName.split(' ')[0]} <span className="text-primary/40">{settings.siteName.split(' ').slice(1).join(' ')}</span>
              </span>
              <span className="text-[10px] font-light opacity-50 block uppercase tracking-widest leading-none text-primary">{t('viz_studio')}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className="text-sm font-medium text-primary/80 hover:text-brand-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <button onClick={toggleTheme} className="p-2 hover:bg-[var(--glass-bg)] rounded-full transition-colors text-primary/80">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>
            <button onClick={toggleLang} className="p-2 hover:bg-[var(--glass-bg)] rounded-full transition-colors text-primary/80">
              <Globe className="w-5 h-5" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-primary/90 hover:text-brand-accent"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  {t('dashboard')}
                </Link>
                <button 
                  onClick={() => { signOut(); navigate('/'); }}
                  className="p-2 hover:bg-red-500/20 text-red-400 rounded-full transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login"
                  className="text-sm font-medium text-primary/80 hover:text-primary"
                >
                  {t('login')}
                </Link>
                <Link 
                  to="/register"
                  className="btn-primary"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
             <button onClick={toggleTheme} className="p-2 hover:bg-[var(--glass-bg)] rounded-full transition-colors text-primary/80">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-primary/60 hover:text-primary"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card !rounded-none !bg-[var(--bg-primary)]/95 !border-none border-t border-[var(--glass-border)] overflow-hidden backdrop-blur-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-primary/70 hover:text-brand-accent border-b border-[var(--glass-border)]"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <button 
                  onClick={() => { toggleLang(); setIsOpen(false); }}
                  className="flex items-center gap-2 px-3 py-4 text-base font-medium text-primary/70"
                >
                  <Globe className="w-5 h-5" />
                  {t('language_name')}
                </button>
                {user ? (
                   <Link
                   to="/dashboard"
                   onClick={() => setIsOpen(false)}
                   className="block px-3 py-4 text-base font-medium text-black bg-brand-accent rounded-lg text-center"
                 >
                   {t('dashboard')}
                 </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-4 text-base font-medium text-primary/70"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-4 text-center text-base font-medium text-black bg-brand-accent rounded-lg"
                    >
                      {t('register')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
