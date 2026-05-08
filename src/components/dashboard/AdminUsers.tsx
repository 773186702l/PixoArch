import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { useTranslation } from 'react-i18next';
import { Shield, User, Trash2, Edit, Search, UserCheck, UserX, Mail, MoreHorizontal, Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const snapshot = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'users');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const toggleRole = async (id: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'client' : 'admin';
    if (!confirm(t('confirm_role_change', { role: nextRole }))) return;
    
    try {
      await updateDoc(doc(db, 'users', id), { role: nextRole });
      setUsers(users.map(u => u.id === id ? { ...u, role: nextRole } : u));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${id}`);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm(t('confirm_delete_user'))) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${id}`);
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 animate-pulse glass-card h-96"></div>;

  return (
    <div className="space-y-8 text-primary">
      <div>
          <h1 className="text-4xl font-display font-light text-primary mb-2">{t('users_list')}.</h1>
          <p className="text-primary/50 text-sm">{t('manage_access')}</p>
      </div>

      <div className="glass-card overflow-hidden">
          <div className="p-8 border-b border-[var(--glass-border)] flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('search_placeholder')} 
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-[var(--glass-border)] rounded-2xl outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all text-sm text-primary"
                  />
              </div>
              <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-accent p-2">
                      <UserCheck className="w-4 h-4" /> {t('active')}
                  </button>
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/20 p-2 italic">
                      <UserX className="w-4 h-4" /> {t('banned')}
                  </button>
              </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white/5 border-b border-[var(--glass-border)]">
                        <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-primary/40">{t('identity')}</th>
                        <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-primary/40">{t('communication')}</th>
                        <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-primary/40">{t('privileges')}</th>
                        <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-primary/40">{t('registered')}</th>
                        <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-primary/40 text-right">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u, i) => (
                        <motion.tr 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={u.id} 
                          className="hover:bg-white/5 transition-colors"
                        >
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent font-bold uppercase">
                                        {u.fullName?.charAt(0)}
                                    </div>
                                    <span className="font-bold text-primary tracking-tight">{u.fullName}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-2 text-xs text-primary/50 font-mono">
                                    <Mail className="w-3 h-3 text-brand-accent" />
                                    {u.email}
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                    u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' :
                                    u.role === 'architect' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-primary/40'
                                }`}>
                                    {t(u.role)}
                                </span>
                            </td>
                            <td className="px-8 py-6 text-[10px] font-mono text-primary/30 tracking-tighter">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'LEGACY'}
                            </td>
                            <td className="px-8 py-6 text-right">
                                <div className="flex justify-end gap-3">
                                    <button 
                                        onClick={() => toggleRole(u.id, u.role)}
                                        className="p-2.5 bg-white/5 text-primary/30 hover:bg-brand-accent hover:text-black rounded-xl transition-all"
                                        title={t('toggle_privileges')}
                                    >
                                        <Shield className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => deleteUser(u.id)}
                                        className="p-2.5 bg-white/5 text-primary/30 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                        title={t('wipe_profile')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
            {filteredUsers.length === 0 && !loading && (
                <div className="p-20 text-center text-primary/20">
                    <Fingerprint className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="uppercase tracking-widest text-xs font-bold font-mono">{t('archive_empty')}</p>
                </div>
            )}
          </div>
      </div>
    </div>
  );
}
