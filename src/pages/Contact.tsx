import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function Contact() {
  const { t } = useTranslation();
  const { settings } = useSettings();

  return (
    <div className="min-h-screen">
      <header className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-display font-light mb-6 text-primary"
            >
              {t('contact_title')} <span className="text-brand-accent italic">{t('contact_title_span')}</span>
            </motion.h1>
            <p className="text-primary/50 text-lg md:text-xl font-light">{t('contact_desc')}</p>
          </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              {/* Contact Info */}
              <div className="space-y-12">
                  <div>
                      <h2 className="text-4xl font-display font-light mb-8 text-primary">{t('get_in_touch')}</h2>
                      <p className="text-primary/50 text-lg font-light leading-relaxed">
                          {t('contact_intro')}
                      </p>
                  </div>

                  <div className="space-y-8">
                      <div className="flex items-center gap-6 group">
                          <div className="w-16 h-16 rounded-2xl bg-[var(--glass-bg)] flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-black transition-all border border-[var(--glass-border)]">
                              <Mail className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 mb-1">{t('email_us')}</p>
                              <p className="text-lg font-bold text-primary">{settings.contactEmail}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-6 group">
                          <div className="w-16 h-16 rounded-2xl bg-[var(--glass-bg)] flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-black transition-all border border-[var(--glass-border)]">
                              <Phone className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 mb-1">{t('call_us')}</p>
                              <p className="text-lg font-bold text-primary">{settings.contactPhone}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-6 group">
                          <div className="w-16 h-16 rounded-2xl bg-[var(--glass-bg)] flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-black transition-all border border-[var(--glass-border)]">
                              <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 mb-1">{t('our_studio_label')}</p>
                              <p className="text-lg font-bold text-primary">{settings.address}</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Contact Form */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-10 md:p-14"
              >
                  <form className="space-y-6 text-primary">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <div>
                               <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-2">{t('first_name')}</label>
                               <input type="text" className="w-full bg-[var(--input-bg)] border-[var(--glass-border)] text-primary" placeholder="John" />
                           </div>
                           <div>
                               <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-2">{t('last_name')}</label>
                               <input type="text" className="w-full bg-[var(--input-bg)] border-[var(--glass-border)] text-primary" placeholder="Doe" />
                           </div>
                       </div>
                       <div>
                           <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-2">{t('email_address')}</label>
                           <input type="email" className="w-full bg-[var(--input-bg)] border-[var(--glass-border)] text-primary" placeholder="john@example.com" />
                       </div>
                       <div>
                           <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-2">{t('your_message')}</label>
                           <textarea rows={5} className="w-full bg-[var(--input-bg)] border-[var(--glass-border)] text-primary" placeholder="Tell us about your project..."></textarea>
                       </div>
                       <button className="btn-primary w-full py-5 text-black font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-brand-accent/20 transition-all">
                           {t('send_message')}
                           <Send className="w-4 h-4 text-black" />
                       </button>
                  </form>
              </motion.div>
          </div>
      </section>

      <section className="h-[500px] mt-20 relative overflow-hidden backdrop-blur-3xl bg-[var(--glass-bg)] border-y border-[var(--glass-border)]">
          <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8 glass-card max-w-sm">
                  <MapPin className="w-12 h-12 text-brand-accent mx-auto mb-4" />
                  <h4 className="font-bold mb-2 text-primary italic capitalize">{t('location_map')}</h4>
                  <p className="text-[10px] text-primary/40 uppercase tracking-widest mb-4">{settings.address}</p>
                  <p className="text-xs text-brand-accent font-mono">{t('map_interface_active')}</p>
              </div>
          </div>
      </section>
    </div>
  );
}
