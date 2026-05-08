import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-[var(--bg-primary)]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/pixo_hero/1920/1080"
            alt="Hero Architectural Render"
            className="w-full h-full object-cover opacity-40 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/60 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest text-brand-accent uppercase bg-brand-accent/10 rounded-full">
              Pixo Arch Studio
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-[var(--text-primary)] leading-tight mb-6">
              {t('hero_title')}
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-primary)]/70 mb-10 font-light leading-relaxed">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/request-project"
                className="group px-8 py-4 bg-brand-accent text-black font-bold rounded-full flex items-center justify-center gap-2 hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all transform hover:-translate-y-1 active:scale-95"
              >
                {t('cta_request')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
              </Link>
              <Link 
                to="/projects"
                className="px-8 py-4 bg-[var(--text-primary)]/10 text-[var(--text-primary)] font-semibold rounded-full border border-[var(--text-primary)]/20 hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all backdrop-blur-sm flex items-center justify-center"
              >
                {t('cta_gallery')}
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--text-primary)]/40 font-medium">{t('scroll')}</span>
            <div className="w-px h-12 bg-gradient-to-b from-brand-accent to-transparent"></div>
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                    <h2 className="text-xs font-bold tracking-[0.2em] text-brand-accent uppercase mb-4">{t('portfolio')}</h2>
                    <h3 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-primary)]">{t('featured_projects')}</h3>
                </div>
                <Link to="/projects" className="text-sm font-semibold flex items-center gap-2 group text-[var(--text-primary)]/70 hover:text-brand-accent transition-colors">
                    {t('explore_all')}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -10 }}
                        className="group relative overflow-hidden glass-card aspect-[4/5] !p-0"
                    >
                        <img 
                            src={`https://picsum.photos/seed/project_${i}/800/1000`}
                            alt="Project Thumb"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale hover:grayscale-0"
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 via-[var(--bg-primary)]/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 transform group-hover:-translate-y-2 transition-all duration-300 w-full">
                            <span className="text-xs text-brand-accent font-bold uppercase tracking-widest mb-2 block">{t('residential')}</span>
                            <h4 className="text-2xl text-[var(--text-primary)] font-bold mb-4">{t('sands_villa')}</h4>
                            <Link 
                                to={`/projects/${i}`} 
                                className="inline-flex items-center gap-2 text-sm text-[var(--text-primary)]/80 hover:text-brand-accent"
                            >
                                {t('view_project')} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Stats/Facts */}
      <section className="py-20 bg-[var(--text-primary)]/5 backdrop-blur-md border-y border-[var(--text-primary)]/10 text-[var(--text-primary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                  <div>
                      <div className="text-5xl font-display font-bold text-brand-accent mb-2">150+</div>
                      <div className="text-xs font-bold text-[var(--text-primary)]/40 uppercase tracking-widest">{t('projects_done')}</div>
                  </div>
                  <div>
                      <div className="text-5xl font-display font-bold text-brand-accent mb-2">12+</div>
                      <div className="text-xs font-bold text-[var(--text-primary)]/40 uppercase tracking-widest">{t('countries')}</div>
                  </div>
                  <div>
                      <div className="text-5xl font-display font-bold text-brand-accent mb-2">99%</div>
                      <div className="text-xs font-bold text-[var(--text-primary)]/40 uppercase tracking-widest">{t('happy_clients')}</div>
                  </div>
                  <div>
                      <div className="text-5xl font-display font-bold text-brand-accent mb-2">50+</div>
                      <div className="text-xs font-bold text-[var(--text-primary)]/40 uppercase tracking-widest">{t('team_members')}</div>
                  </div>
              </div>
          </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-display font-bold mb-4 text-[var(--text-primary)]">{t('testimonials_title')}</h2>
                  <div className="flex justify-center gap-1 text-brand-accent">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1,2,3].map(i => (
                    <div key={i} className="glass-card p-10 flex flex-col justify-between border border-[var(--glass-border)] bg-[var(--glass-bg)]">
                        <p className="text-[var(--text-primary)]/80 italic leading-relaxed mb-8">
                            {t('testimonial_1')}
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-[var(--glass-border)] overflow-hidden">
                                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Client" />
                            </div>
                            <div>
                                <h5 className="font-bold text-[var(--text-primary)]">{t('testimonial_client_1')}</h5>
                                <span className="text-xs text-brand-accent uppercase font-bold tracking-tighter">{t('testimonial_role_1')}</span>
                            </div>
                        </div>
                    </div>
                  ))}
              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-accent">
          <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-black mb-8 tracking-tighter">
                  {t('ready_title')}
              </h2>
              <p className="text-xl text-black/70 mb-12 max-w-2xl mx-auto">
                  {t('ready_subtitle')}
              </p>
              <Link 
                to="/request-project"
                className="inline-flex py-4 px-12 bg-black text-white font-bold rounded-full hover:brightness-125 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-black/20"
              >
                  {t('get_started')}
              </Link>
          </div>
      </section>
    </div>
  );
}
