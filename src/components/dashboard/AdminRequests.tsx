import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, XCircle, Search, MessageSquare, AlertCircle } from 'lucide-react';

export default function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'requests');
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await updateDoc(doc(db, 'requests', id), {
        status,
        updatedAt: new Date().toISOString()
      });
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `requests/${id}`);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="p-10 animate-pulse glass-card h-96"></div>;

  return (
    <div className="space-y-8 text-white">
      <div>
          <h1 className="text-4xl font-display font-light text-white mb-2">Project Requests.</h1>
          <p className="text-white/50 text-sm">Review, approve, or reject client architectural requests.</p>
      </div>

      <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                 <input 
                    type="text" 
                    placeholder="Search requests..." 
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-brand-accent/50 text-sm"
                 />
              </div>
              <div className="flex gap-2">
                  <button className="px-4 py-2 bg-brand-accent text-black text-[10px] font-bold uppercase tracking-widest rounded-lg">Active</button>
                  <button className="px-4 py-2 bg-white/5 text-white/30 text-[10px] font-bold uppercase tracking-widest rounded-lg">History</button>
              </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/40">Client Info</th>
                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/40">Project Detail</th>
                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/40">Status</th>
                        <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-white/40 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {requests.map((req, i) => (
                        <motion.tr 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={req.id} 
                          className="hover:bg-white/5 transition-colors"
                        >
                            <td className="px-6 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-brand-accent border border-white/10 uppercase">
                                        {req.clientName?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{req.clientName || 'Anonymous Client'}</p>
                                        <p className="text-[10px] text-white/30 font-mono tracking-tighter">{new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-6">
                                <div className="space-y-1">
                                    <p className="font-bold text-white text-sm">{req.projectType}</p>
                                    <p className="text-[10px] text-brand-accent font-mono uppercase tracking-widest">{req.budget}</p>
                                </div>
                            </td>
                            <td className="px-6 py-6">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                                    req.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                    {req.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                                    {req.status === 'approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    {req.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                                    {req.status}
                                </div>
                            </td>
                            <td className="px-6 py-6 text-right">
                                <div className="flex justify-end gap-3">
                                    <button 
                                        onClick={() => updateStatus(req.id, 'approved')}
                                        disabled={updating === req.id || req.status === 'approved'}
                                        className="p-2 bg-white/5 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-10"
                                        title="Approve"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(req.id, 'rejected')}
                                        disabled={updating === req.id || req.status === 'rejected'}
                                        className="p-2 bg-white/5 text-red-500 rounded-lg hover:bg-red-500 hover:text-black transition-all disabled:opacity-10"
                                        title="Reject"
                                    >
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-white/5 text-brand-accent rounded-lg hover:bg-brand-accent hover:text-black transition-all" title="Message">
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
            {requests.length === 0 && (
                <div className="p-20 text-center text-white/20">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="uppercase tracking-widest text-xs font-bold">No results found.</p>
                </div>
            )}
          </div>
      </div>
    </div>
  );
}
