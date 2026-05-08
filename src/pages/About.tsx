import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Target, Users, Eye, Zap, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const { t } = useTranslation();
  
  const values = [
    { icon: Target, title: t('precision_title'), desc: t('precision_desc') },
    { icon: Zap, title: t('speed_title'), desc: t('speed_desc') },
    { icon: Eye, title: t('vision_title'), desc: t('vision_desc') },
    { icon: Shield, title: t('trust_title'), desc: t('trust_desc') },
  ];

  return (
    <div className="bg-[var(--bg-primary)]">
      {/* Hero */}
      <section className="relative py-32 md:py-48 overflow-hidden bg-[var(--bg-primary)] text-primary">
          <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl"
              >
                  <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter mb-8 leading-[0.9] text-primary">
                    {t('about_hero_title')} <span className="text-brand-accent underline decoration-4 underline-offset-8">{t('about_hero_title_span')}</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-primary/50 font-light leading-relaxed">
                    {t('about_hero_desc')}
                  </p>
              </motion.div>
          </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v, i) => (
                <motion.div 
                    key={v.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-10 glass-card !rounded-[2.5rem] border-[var(--glass-border)] hover:border-brand-accent/20 transition-all group"
                >
                    <div className="mb-6 w-14 h-14 bg-[var(--glass-bg)] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <v.icon className="w-6 h-6 text-brand-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-primary">{v.title}</h3>
                    <p className="text-primary/50 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
          </div>
      </section>

      {/* Team / Culture */}
      <section className="py-24 bg-[var(--glass-bg)] border-y border-[var(--glass-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    <div className="lg:w-1/2 relative px-4">
                        <div className="aspect-[3/4] bg-[var(--bg-primary)] rounded-[3rem] overflow-hidden rotate-2 shadow-2xl relative z-10 border border-[var(--glass-border)]">
                            <img 
                                src="https://picsum.photos/seed/pixo_team/800/1000" 
                                alt="Studio Culture" 
                                className="w-full h-full object-cover opacity-80"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-accent rounded-[2rem] -rotate-6 z-0 flex flex-col items-center justify-center p-8 text-center text-black">
                            <Sparkles className="w-8 h-8 mb-4 block mx-auto text-black" />
                            <span className="text-xs font-bold leading-tight block">{t('innovation_since')}</span>
                        </div>
                    </div>
                    
                    <div className="lg:w-1/2 space-y-10 px-4">
                        <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight text-primary">{t('our_mission_title')}</h2>
                        <div className="space-y-6 text-primary/60 font-light text-lg">
                            <p>
                                {t('our_mission_p1')}
                            </p>
                            <p>
                                {t('our_mission_p2')}
                            </p>
                        </div>
                        <Link to="/contact" className="inline-flex items-center gap-2 font-bold text-brand-accent group">
                            {t('join_journey')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
          </div>
      </section>
    </div>
  );
}
