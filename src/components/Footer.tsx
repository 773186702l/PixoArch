import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function Footer() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  
  return (
    <footer className="glass-card !rounded-none !bg-transparent !border-none pt-20 pb-10 mt-20 border-t border-[var(--glass-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 px-4">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tighter mb-6 block text-primary uppercase group">
              {settings.siteName.split(' ')[0]} <span className="text-brand-accent group-hover:italic transition-all">{settings.siteName.split(' ').slice(1).join(' ')}</span>
            </Link>
            <p className="text-primary/50 text-sm leading-relaxed mb-6 font-light">
              {t('footer_desc')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="p-2 bg-[var(--glass-bg)] rounded-full hover:bg-brand-accent hover:text-black transition-all text-primary"><Instagram className="w-5 h-5" /></a>}
              {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="p-2 bg-[var(--glass-bg)] rounded-full hover:bg-brand-accent hover:text-black transition-all text-primary"><Facebook className="w-5 h-5" /></a>}
              {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="p-2 bg-[var(--glass-bg)] rounded-full hover:bg-brand-accent hover:text-black transition-all text-primary"><Linkedin className="w-5 h-5" /></a>}
              {settings.twitterUrl && <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="p-2 bg-[var(--glass-bg)] rounded-full hover:bg-brand-accent hover:text-black transition-all text-primary"><Twitter className="w-5 h-5" /></a>}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-brand-accent uppercase text-xs tracking-widest">{t('home')}</h4>
            <ul className="space-y-4 text-sm text-primary/60">
              <li><Link to="/about" className="hover:text-primary transition-colors">{t('our_story')}</Link></li>
              <li><Link to="/projects" className="hover:text-primary transition-colors">{t('projects')}</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">{t('latest_news')}</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">{t('faq')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-brand-accent uppercase text-xs tracking-widest">{t('projects')}</h4>
            <ul className="space-y-4 text-sm text-primary/60">
              <li><Link to="/projects?cat=residential" className="hover:text-primary transition-colors">{t('residential')}</Link></li>
              <li><Link to="/projects?cat=commercial" className="hover:text-primary transition-colors">{t('commercial')}</Link></li>
              <li><Link to="/projects?cat=interior" className="hover:text-primary transition-colors">{t('interior_design')}</Link></li>
              <li><Link to="/projects?cat=urban" className="hover:text-primary transition-colors">{t('urban_planning')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-brand-accent uppercase text-xs tracking-widest">{t('contact')}</h4>
            <ul className="space-y-4 text-sm text-primary/60">
              <li className="flex items-center gap-3 font-light"><Mail className="w-4 h-4 text-brand-accent" /> {settings.contactEmail}</li>
              <li className="flex items-center gap-3 font-light"><Phone className="w-4 h-4 text-brand-accent" /> {settings.contactPhone}</li>
              <li className="flex items-center gap-3 font-light"><MapPin className="w-4 h-4 text-brand-accent" /> {settings.address}</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[var(--glass-border)] text-center text-[10px] text-primary/30 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} {settings.siteName}. {t('all_rights')}</p>
        </div>
      </div>
    </footer>
  );
}
