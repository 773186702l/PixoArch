import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Mail, Lock, Loader2, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetMessage('');

    try {
      await resetPassword(resetEmail);
      setResetMessage('Password reset link sent! Check your inbox.');
      setResetEmail('');
    } catch (err: any) {
      setResetError(err.message || 'Failed to send reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold text-brand-accent mb-2">{t('welcome_back')}</h1>
            <p className="text-primary/50 text-sm">{t('login_subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-2">{t('email_address')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent">{t('password')}</label>
                <button 
                  type="button" 
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] uppercase font-bold text-primary/40 hover:text-brand-accent transition-colors"
                >
                  {t('forgot_password')}
                </button>
              </div>
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

            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-xs tracking-widest uppercase flex items-center justify-center gap-2 group text-black"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {t('sign_in')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[var(--glass-border)] text-center">
            <p className="text-sm text-primary/50">
              {t('no_account')} {' '}
              <Link to="/register" className="text-brand-accent font-bold hover:underline">
                {t('register_here')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForgotModal(false)}
              className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-sm p-8 relative z-10 border-[var(--glass-border)] !bg-[var(--bg-primary)]"
            >
              <button 
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 p-2 text-primary/30 hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-brand-accent" />
                </div>
                <h2 className="text-2xl font-display font-light text-primary italic">{t('reset_identity').split(' ')[0]} <span className="font-bold text-brand-accent not-italic">{t('reset_identity').split(' ')[1]}</span></h2>
                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mt-2">{t('recover_access')}</p>
              </div>

              {resetMessage ? (
                <div className="text-center space-y-6">
                  <p className="text-emerald-400 text-sm font-medium">{t('reset_link_sent')}</p>
                  <button 
                    onClick={() => setShowForgotModal(false)}
                    className="btn-primary w-full py-4 text-[10px] font-bold uppercase tracking-widest text-black"
                  >
                    {t('back_to_login')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-2">{t('account_email')}</label>
                    <input 
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-14 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl px-4 text-primary text-sm outline-none focus:ring-2 focus:ring-brand-accent/50"
                      required
                    />
                  </div>

                  {resetError && <p className="text-red-500 text-xs text-center">{resetError}</p>}

                  <button 
                    type="submit"
                    disabled={resetLoading}
                    className="btn-primary w-full py-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 group text-black"
                  >
                    {resetLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        {t('send_reset_link')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
