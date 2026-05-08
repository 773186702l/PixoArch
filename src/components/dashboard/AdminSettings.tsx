import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import { Save, Globe, Mail, Phone, MapPin, Share2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminSettings() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateSettings(formData);
      setMessage(t('settings_updated'));
    } catch (err) {
      setMessage(t('settings_failed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
          <h1 className="text-4xl font-display font-light text-primary mb-2">{t('site_config')}</h1>
          <p className="text-primary/50 text-sm">{t('site_config_desc')}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 space-y-8 border-[var(--glass-border)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                      < Globe className="w-3.5 h-3.5" /> {t('site_title')}
                  </label>
                  <input 
                    type="text" 
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                    placeholder="Pixo Arch Studio"
                  />
              </div>

              <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                      <Mail className="w-3.5 h-3.5" /> {t('contact_email_label')}
                  </label>
                  <input 
                    type="email" 
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                    placeholder="contact@pixoarch.com"
                  />
              </div>

              <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                      <Phone className="w-3.5 h-3.5" /> {t('contact_phone_label')}
                  </label>
                  <input 
                    type="text" 
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                    placeholder="+971 50 123 4567"
                  />
              </div>

              <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                      <MapPin className="w-3.5 h-3.5" /> {t('physical_address')}
                  </label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                    placeholder="Dubai, UAE"
                  />
              </div>
          </div>

          <div className="pt-8 border-t border-[var(--glass-border)]">
              <h3 className="flex items-center gap-2 text-brand-accent text-[10px] font-bold uppercase tracking-widest mb-6">
                  <Share2 className="w-3.5 h-3.5" /> {t('social_connections')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30">{t('instagram_url')}</label>
                      <input 
                        type="text" 
                        value={formData.instagramUrl}
                        onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                        className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                      />
                  </div>
                  <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30">{t('facebook_url')}</label>
                      <input 
                        type="text" 
                        value={formData.facebookUrl}
                        onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                        className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                      />
                  </div>
                  <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30">{t('twitter_url')}</label>
                      <input 
                        type="text" 
                        value={formData.twitterUrl}
                        onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                        className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                      />
                  </div>
                  <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary/30">{t('linkedin_url')}</label>
                      <input 
                        type="text" 
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                      />
                  </div>
              </div>
          </div>

          <div className="flex items-center justify-between pt-6">
              {message && (
                <p className={`text-sm font-medium ${message === t('settings_updated') ? 'text-green-500' : 'text-red-500'}`}>
                    {message}
                </p>
              )}
              <button 
                type="submit" 
                disabled={saving}
                className="btn-primary flex items-center gap-2 px-10 py-4 uppercase text-xs tracking-widest text-black"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Save className="w-4 h-4 text-black" />}
                {t('save_config')}
              </button>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
