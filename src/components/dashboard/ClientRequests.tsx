import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, XCircle, ChevronRight, FileText, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientRequests() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'requests'), 
          where('clientId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'requests');
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, [user]);

  if (loading) return <div className="p-10 animate-pulse glass-card h-64"></div>;

  return (
    <div className="space-y-8 text-primary">
      <div className="flex justify-between items-center">
          <div>
              <h1 className="text-4xl font-display font-light text-primary mb-2">{t('my_archive')}.</h1>
              <p className="text-primary/50 text-sm">{t('track_orders')}</p>
          </div>
          <Link 
            to="/request-project"
            className="btn-primary px-8 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-black" />
            {t('new_request')}
          </Link>
      </div>

      {requests.length > 0 ? (
        <div className="glass-card overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-primary/40">{t('project_type')}</th>
                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-primary/40">{t('date')}</th>
                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-primary/40">{t('status')}</th>
                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-primary/40 text-right">{t('progress')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {requests.map((req, i) => (
                        <motion.tr 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={req.id} 
                          className="hover:bg-white/5 transition-colors group"
                        >
                            <td className="px-6 py-6">
                                <span className="font-bold text-primary tracking-tight">{req.projectType}</span>
                            </td>
                            <td className="px-6 py-6 text-[10px] text-primary/30 font-mono tracking-tighter">
                                {new Date(req.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-6">
                                <div className="flex items-center gap-2">
                                    {req.status === 'pending' && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                                    {req.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                    {req.status === 'rejected' && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                        req.status === 'approved' ? 'text-emerald-400' :
                                        req.status === 'rejected' ? 'text-red-400' : 'text-amber-400'
                                    }`}>
                                        {t(req.status)}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-6 text-right">
                                <button className="p-2 bg-white/5 hover:bg-brand-accent rounded-lg text-primary/30 group-hover:text-black transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
      ) : (
        <div className="glass-card py-20 flex flex-col items-center justify-center border-dashed">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-primary/20" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('no_requests')}</h3>
            <p className="text-primary/30 mb-8 max-w-sm text-center text-sm font-medium">{t('no_requests_desc')}</p>
            <Link to="/request-project" className="px-10 py-4 bg-brand-accent text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:brightness-110 flex items-center gap-2">
              {t('order_render')} <Sparkles className="w-4 h-4" />
            </Link>
        </div>
      )}
    </div>
  );
}
