import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Clock, CheckCircle2, AlertCircle, ArrowUpRight, Folder, FileQuestion } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Overview() {
  const { profile, user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({ requests: 0, active: 0, completed: 0 });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      
      const q = query(
        collection(db, 'requests'), 
        where('clientId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      
      try {
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentRequests(data);
        
        setStats({
          requests: data.length,
          active: data.filter((r: any) => r.status === 'pending').length,
          completed: data.filter((r: any) => r.status === 'approved').length,
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'requests');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [user]);

  const cards = [
    { title: t('all_requests'), value: stats.requests, icon: Folder, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: t('pending'), value: stats.active, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: t('approved'), value: stats.completed, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-4xl font-display font-light text-primary">{t('hello')}, <span className="font-bold text-brand-accent">{profile?.fullName?.split(' ')[0]}</span></h1>
              <p className="text-primary/50 font-medium tracking-tight">{t('viz_center')}.</p>
          </div>
          <div className="flex gap-3">
              <div className="px-5 py-2.5 glass-card text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-[var(--glass-border)]">
                  <TrendingUp className="w-4 h-4 text-brand-accent" />
                  {t('live_stats')}
              </div>
          </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div 
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex items-center gap-6 border-[var(--glass-border)]"
            >
                <div className={`${card.bg} ${card.color} p-4 rounded-2xl border border-[var(--glass-border)]`}>
                    <card.icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-1">{card.title}</p>
                    <h3 className="text-3xl font-bold text-primary">{card.value}</h3>
                </div>
            </motion.div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="glass-card p-8 border-[var(--glass-border)]">
              <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-bold text-primary">{t('recent_requests')}</h3>
                  <button className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1 uppercase tracking-widest">
                      {t('history')} <ArrowUpRight className="w-3 h-3" />
                  </button>
              </div>

              {loading ? (
                <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-20 bg-[var(--glass-bg)] animate-pulse rounded-2xl"></div>)}
                </div>
              ) : recentRequests.length > 0 ? (
                <div className="space-y-4">
                    {recentRequests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--glass-bg)] hover:bg-brand-accent/5 transition-colors border border-[var(--glass-border)]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center font-bold text-brand-accent">
                                {req.projectType.charAt(0)}
                            </div>
                            <div>
                                <h5 className="font-bold text-sm text-primary">{req.projectType}</h5>
                                <p className="text-[10px] text-primary/40 uppercase font-bold tracking-tighter">{new Date(req.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                            req.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                            {t(req.status)}
                        </span>
                    </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-primary/20">
                    <FileQuestion className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-sm font-medium">{t('no_activity')}</p>
                </div>
              )}
          </div>

          {/* Quick Actions / Tips */}
          <div className="space-y-8">
                <div className="glass-card !bg-brand-accent p-8 text-black relative overflow-hidden group border-none">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                        <Folder className="w-32 h-32" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 relative z-10">{t('new_viz_title')}</h3>
                    <p className="text-black/70 mb-8 font-medium relative z-10 leading-relaxed text-sm">
                        {t('new_viz_desc')}
                    </p>
                    <Link 
                        to="/request-project"
                        className="px-8 py-3 bg-black text-white font-bold rounded-xl relative z-10 hover:brightness-125 transition-all text-xs uppercase tracking-widest inline-block"
                    >
                        {t('submit_request')}
                    </Link>
                </div>

                <div className="glass-card !bg-transparent p-8 text-primary flex items-center justify-between border-dashed border-[var(--glass-border)]">
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">{t('arch_special')}</h4>
                        <p className="text-lg font-bold">{t('cloud_engine')}</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
          </div>
      </div>
    </div>
  );
}
