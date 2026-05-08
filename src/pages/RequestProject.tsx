import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Send, Upload, Info, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RequestProject() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectType: 'Residential',
    budget: '$5k - $10k',
    timeline: '1-2 Months',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'requests'), {
        ...formData,
        clientId: user.uid,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      navigate('/dashboard/requests');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center p-4 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full glass-card overflow-hidden flex flex-col md:flex-row border-[var(--glass-border)]"
      >
        <div className="md:w-1/3 bg-[var(--glass-bg)] p-12 text-primary flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-brand-accent/5 -z-10 blur-3xl"></div>
            <div className="relative z-10">
                <h1 className="text-4xl font-display font-light mb-6">{t('start_project_title')} <span className="text-brand-accent">{t('start_project_span')}</span></h1>
                <p className="text-primary/50 font-light leading-relaxed mb-8">
                    {t('request_desc')}
                </p>
                
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--glass-bg)] flex items-center justify-center shrink-0 border border-[var(--glass-border)]">
                            <Info className="w-5 h-5 text-brand-accent" />
                        </div>
                        <div>
                            <h5 className="font-bold text-[10px] uppercase tracking-widest text-primary/70">{t('detailed_info')}</h5>
                            <p className="text-[10px] text-primary/30 uppercase tracking-widest leading-relaxed">{t('detailed_info_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="pt-10 relative z-10">
                <div className="p-4 bg-[var(--glass-bg)] rounded-2xl border border-[var(--glass-border)]">
                    <p className="text-[9px] uppercase font-bold text-primary/30 mb-2 tracking-[0.2em]">{t('need_help')}</p>
                    <p className="text-xs text-primary/70 font-mono tracking-tighter italic">support@pixoarch.com</p>
                </div>
            </div>
        </div>

        <div className="md:w-2/3 p-8 lg:p-16 relative z-10 bg-[var(--bg-primary)]/50">
            <form onSubmit={handleSubmit} className="space-y-8 text-primary">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-3">{t('project_type')}</label>
                        <select 
                            value={formData.projectType}
                            onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                            className="w-full bg-[var(--input-bg)] border-[var(--glass-border)] text-primary rounded-2xl p-3 outline-none"
                        >
                            <option value="Residential" className="bg-[var(--bg-primary)] text-primary">Residential Villa</option>
                            <option value="Commercial" className="bg-[var(--bg-primary)] text-primary">Commercial Building</option>
                            <option value="Interior" className="bg-[var(--bg-primary)] text-primary">Interior Visualization</option>
                            <option value="Landscaping" className="bg-[var(--bg-primary)] text-primary">Landscaping</option>
                            <option value="Urban" className="bg-[var(--bg-primary)] text-primary">Urban Planning</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-3">{t('estimated_budget')}</label>
                        <select 
                            value={formData.budget}
                            onChange={(e) => setFormData({...formData, budget: e.target.value})}
                            className="w-full bg-[var(--input-bg)] border-[var(--glass-border)] text-primary rounded-2xl p-3 outline-none"
                        >
                            <option value="$1k - $5k" className="bg-[var(--bg-primary)] text-primary">$1k - $5k</option>
                            <option value="$5k - $10k" className="bg-[var(--bg-primary)] text-primary">$5k - $10k</option>
                            <option value="$10k - $25k" className="bg-[var(--bg-primary)] text-primary">$10k - $25k</option>
                            <option value="$25k+" className="bg-[var(--bg-primary)] text-primary">$25k+</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-3">{t('desc_requirements')}</label>
                    <textarea 
                        rows={6}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-[var(--input-bg)] border-[var(--glass-border)] text-primary rounded-2xl p-4 outline-none placeholder:text-primary/20"
                        placeholder={t('vision_placeholder')}
                        required
                    />
                </div>

                <div className="glass-card !bg-[var(--glass-bg)] border-dashed border-2 border-[var(--glass-border)] hover:border-brand-accent transition-colors cursor-pointer text-center p-8 group">
                    <Upload className="w-8 h-8 text-primary/20 mx-auto mb-3 group-hover:text-brand-accent transition-colors" />
                    <p className="text-[10px] uppercase tracking-widest font-bold text-primary/40">{t('drag_blueprints')}</p>
                    <p className="text-[9px] text-primary/20 mt-1 uppercase tracking-widest">{t('max_file_size')}</p>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 group shadow-xl shadow-brand-accent/5"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      {t('submit_request')}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
            </form>
        </div>
      </motion.div>
    </div>
  );
}
