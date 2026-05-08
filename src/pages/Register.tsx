import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Mail, Lock, User, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'client' | 'architect'>('client');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError(t('pass_mismatch'));
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        fullName,
        email,
        role: role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 flex items-center justify-center p-4 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full glass-card overflow-hidden flex flex-col md:flex-row"
      >
        <div className="md:w-5/12 bg-[var(--bg-primary)] p-12 flex flex-col justify-between relative overflow-hidden backdrop-blur-md border-r border-[var(--glass-border)]">
             <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl"></div>
             <div className="relative z-10">
                <h2 className="text-4xl font-display font-light mb-6 text-primary leading-tight">{t('join_pixo').split(' ')[0]} <span className="text-brand-accent">{t('join_pixo').split(' ')[1]} {t('join_pixo').split(' ')[2]}</span></h2>
                <p className="text-primary/50 font-light leading-relaxed mb-10">
                    {t('join_desc')}
                </p>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-brand-accent" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/70">{t('secure_account')}</span>
                    </div>
                </div>
             </div>
             <div className="pt-8 border-t border-[var(--glass-border)] mt-12 relative z-10">
                 <p className="text-[10px] text-primary/30 uppercase tracking-[0.2em] font-bold">{t('precision_since')}</p>
             </div>
        </div>

        <div className="md:w-7/12 p-8 md:p-12 relative z-10">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-2">{t('full_name')}</label>
                   <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
                     <input 
                       type="text"
                       value={fullName}
                       onChange={(e) => setFullName(e.target.value)}
                       className="w-full pl-12 bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                       placeholder="John Doe"
                       required
                     />
                   </div>
                </div>

                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-2">{t('email_address')}</label>
                   <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
                     <input 
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full pl-12 bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                       placeholder="john@example.com"
                       required
                     />
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-2">{t('password')}</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-2">{t('confirm_password_label')}</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
                            <input 
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-4">{t('i_am_a')}</label>
                    <div className="flex gap-4">
                        <button 
                            type="button"
                            onClick={() => setRole('client')}
                            className={`flex-1 py-3 px-4 rounded-xl text-[10px] uppercase tracking-widest font-bold border-2 transition-all ${role === 'client' ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-[var(--glass-border)] text-primary/40 hover:border-primary/20'}`}
                        >
                            {t('client')}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setRole('architect')}
                            className={`flex-1 py-3 px-4 rounded-xl text-[10px] uppercase tracking-widest font-bold border-2 transition-all ${role === 'architect' ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-[var(--glass-border)] text-primary/40 hover:border-primary/20'}`}
                        >
                            {t('architect')}
                        </button>
                    </div>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 uppercase tracking-widest text-xs flex items-center justify-center gap-2 group mt-4 text-black"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {t('create_account_btn')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-black" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-primary/50">
              {t('already_account')} {' '}
              <Link to="/login" className="text-brand-accent font-bold hover:underline">
                {t('sign_in')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
