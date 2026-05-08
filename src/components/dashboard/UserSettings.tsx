import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Shield, 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  Save, 
  Loader2,
  Camera
} from 'lucide-react';

export default function UserSettings() {
  const { profile, user, resetPassword } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    avatarUrl: profile?.avatarUrl || '',
    language: i18n.language,
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        fullName: formData.fullName,
        avatarUrl: formData.avatarUrl,
        updatedAt: new Date().toISOString()
      });
      setMessage(t('settings_updated'));
    } catch (err) {
      console.error(err);
      setMessage(t('settings_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    setResetLoading(true);
    try {
      await resetPassword(user.email);
      setMessage(t('reset_link_sent'));
    } catch (err) {
      console.error(err);
      setMessage(t('settings_failed'));
    } finally {
      setResetLoading(false);
    }
  };

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setFormData({ ...formData, language: lang });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--glass-border)] pb-8">
          <div>
              <h1 className="text-4xl font-display font-light text-primary mb-2">{t('personal_vault')}.</h1>
              <p className="text-primary/50 text-sm">{t('manage_identity_desc')}</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-8">
              <form onSubmit={handleUpdateProfile} className="glass-card p-8 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                      <User size={120} />
                  </div>
                  
                  <div className="flex items-center gap-6 relative z-10">
                      <div className="relative group">
                          <div className="w-24 h-24 rounded-2xl bg-brand-accent flex items-center justify-center text-3xl font-bold text-black border-4 border-[var(--bg-primary)] shadow-2xl relative overflow-hidden">
                              {formData.avatarUrl ? (
                                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                profile?.fullName?.charAt(0) || 'U'
                              )}
                          </div>
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-primary">{profile?.fullName}</h3>
                          <p className="text-xs text-brand-accent font-bold uppercase tracking-widest mt-1">{profile?.role}</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                      <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-accent block mb-2">{t('full_name')}</label>
                          <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
                              <input 
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] text-primary rounded-xl outline-none focus:border-brand-accent transition-all"
                              />
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-accent block mb-2">{t('avatar_url')}</label>
                          <div className="relative">
                              <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
                              <input 
                                type="text"
                                value={formData.avatarUrl}
                                onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] text-primary rounded-xl outline-none focus:border-brand-accent transition-all"
                                placeholder="https://..."
                              />
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-accent block mb-2">{t('email_address')}</label>
                          <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
                              <input 
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--glass-border)] text-primary/40 rounded-xl outline-none cursor-not-allowed"
                              />
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 relative z-10">
                      {message && <p className={`text-xs font-bold ${message.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>{message}</p>}
                      <button 
                        type="submit"
                        disabled={loading}
                        className="ml-auto btn-primary px-8 py-3 flex items-center gap-2"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {t('synchronize_profile')}
                      </button>
                  </div>
              </form>
          </div>

          {/* Preferences Section */}
          <div className="space-y-6">
              <div className="glass-card p-6 space-y-6">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center">
                          <Settings className="w-4 h-4 text-brand-accent" />
                      </div>
                      <h4 className="font-bold text-primary">{t('experience_params')}</h4>
                  </div>

                  <div className="space-y-4">
                      <div className="space-y-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">{t('visual_mode')}</p>
                          <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => setTheme('light')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${theme === 'light' ? 'bg-brand-accent text-black border-brand-accent' : 'bg-[var(--glass-bg)] text-primary border-[var(--glass-border)]'}`}
                              >
                                  <Sun className="w-4 h-4" />
                                  <span className="text-xs font-bold uppercase">{t('light')}</span>
                              </button>
                              <button 
                                onClick={() => setTheme('dark')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${theme === 'dark' ? 'bg-brand-accent text-black border-brand-accent' : 'bg-[var(--glass-bg)] text-primary border-[var(--glass-border)]'}`}
                              >
                                  <Moon className="w-4 h-4" />
                                  <span className="text-xs font-bold uppercase">{t('dark')}</span>
                              </button>
                          </div>
                      </div>

                      <div className="space-y-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">{t('interface_language')}</p>
                          <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => toggleLanguage('en')}
                                className={`p-3 rounded-xl border transition-all ${i18n.language === 'en' ? 'bg-brand-accent text-black border-brand-accent' : 'bg-[var(--glass-bg)] text-primary border-[var(--glass-border)]'}`}
                              >
                                  <span className="text-xs font-bold uppercase">English</span>
                              </button>
                              <button 
                                onClick={() => toggleLanguage('ar')}
                                className={`p-3 rounded-xl border transition-all ${i18n.language === 'ar' ? 'bg-brand-accent text-black border-brand-accent' : 'bg-[var(--glass-bg)] text-primary border-[var(--glass-border)]'}`}
                              >
                                  <span className="text-xs font-bold uppercase">العربية</span>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="glass-card p-6 border-red-500/10">
                  <div className="flex items-center gap-3 text-red-400 mb-4">
                      <Shield className="w-4 h-4" />
                      <h4 className="font-bold">{t('security')}</h4>
                  </div>
                  <p className="text-xs text-primary/40 mb-4">{t('security_desc')}</p>
                  <button 
                    onClick={handleResetPassword}
                    disabled={resetLoading}
                    className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                      {resetLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                      {t('reset_access_credentials')}
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}
