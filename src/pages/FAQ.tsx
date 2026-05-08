import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, Minus, Search, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: t('faq_1_q'),
      answer: t('faq_1_a')
    },
    {
      id: 2,
      question: t('faq_2_q'),
      answer: t('faq_2_a')
    },
    {
      id: 3,
      question: t('faq_3_q'),
      answer: t('faq_3_a')
    },
    {
      id: 4,
      question: t('faq_4_q'),
      answer: t('faq_4_a')
    },
    {
      id: 5,
      question: t('faq_5_q'),
      answer: t('faq_5_a')
    }
  ];

  return (
    <div className="min-h-screen relative bg-[var(--bg-primary)]">
      <header className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-8xl font-display font-light text-primary mb-6 tracking-tighter">{t('faq_title')} <span className="text-brand-accent italic font-normal">{t('faq_title_span')}</span></h1>
            <p className="text-primary/40 text-lg font-light max-w-2xl mx-auto">{t('faq_subtitle')}</p>
          </div>
      </header>

      <section className="py-24 max-w-3xl mx-auto px-4">
          <div className="relative mb-16">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
              <input 
                type="text" 
                placeholder={t('search_faq')} 
                className="w-full pl-16 pr-8 py-6 glass-card bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl outline-none focus:border-brand-accent transition-all font-medium text-primary placeholder:text-primary/20"
              />
          </div>

          <div className="space-y-4">
              {faqs.map((faq) => (
                <div 
                    key={faq.id}
                    className={`glass-card overflow-hidden transition-all !duration-500 border border-[var(--glass-border)] ${activeId === faq.id ? 'bg-brand-accent/5 shadow-xl shadow-brand-accent/5 ring-1 ring-brand-accent/20' : 'bg-[var(--glass-bg)]'}`}
                >
                    <button 
                        onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
                        className="w-full px-8 py-8 flex items-center justify-between text-left group"
                    >
                        <span className={`text-lg font-display font-light transition-colors ${activeId === faq.id ? 'text-brand-accent' : 'text-primary/60 group-hover:text-primary'}`}>
                            {faq.question}
                        </span>
                        <div className={`p-2 rounded-full transition-all duration-500 ${activeId === faq.id ? 'bg-brand-accent text-black rotate-180 shadow-lg shadow-brand-accent/30' : 'bg-[var(--glass-bg)] text-primary/30 border border-[var(--glass-border)]'}`}>
                            <ChevronDown className="w-5 h-5" />
                        </div>
                    </button>
                    
                    <AnimatePresence>
                        {activeId === faq.id && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                            >
                                <div className="px-8 pb-8 text-primary/50 leading-relaxed font-light">
                                    <div className="h-px bg-[var(--glass-border)] mb-6"></div>
                                    {faq.answer}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
              ))}
          </div>

          <div className="mt-20 p-12 glass-card !bg-brand-accent rounded-[3rem] text-center text-black relative overflow-hidden group border-none shadow-2xl shadow-brand-accent/20">
                <div className="absolute top-0 left-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-32 h-32 text-black" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-4 relative z-10">{t('still_questions')}</h3>
                <p className="text-black/60 mb-8 font-medium relative z-10">{t('still_questions_desc')}</p>
                <Link to="/contact" className="inline-flex py-4 px-10 bg-black text-white text-[10px] uppercase tracking-widest font-bold rounded-2xl relative z-10 hover:brightness-125 transition-all shadow-xl shadow-black/20">
                    {t('talk_team')}
                </Link>
          </div>
      </section>
    </div>
  );
}
