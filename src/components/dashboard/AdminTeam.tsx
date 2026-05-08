import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Save, X, User, Image as ImageIcon } from 'lucide-react';

export default function AdminTeam() {
  const { t } = useTranslation();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    photoUrl: '',
    order: 0
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    const q = query(collection(db, 'team'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'team'), {
        ...formData,
        order: members.length,
        createdAt: serverTimestamp()
      });
      setShowAddForm(false);
      setFormData({ name: '', role: '', description: '', photoUrl: '', order: 0 });
      fetchTeam();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'team', id), data);
      setEditingId(null);
      fetchTeam();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      await deleteDoc(doc(db, 'team', id));
      fetchTeam();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-light text-primary">{t('manage_team')}</h2>
          <p className="text-primary/50 text-sm">{t('team_desc')}</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary py-3 px-6 text-black flex items-center gap-2 font-bold"
        >
          <Plus className="w-5 h-5" /> {t('add_member')}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-8 border-[var(--glass-border)]"
          >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-primary">{t('add_member')}</h3>
                <button onClick={() => setShowAddForm(false)}><X className="w-6 h-6 text-primary/40 hover:text-primary" /></button>
            </div>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-brand-accent block mb-2">{t('full_name')}</label>
                        <input 
                            type="text" required 
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-[var(--input-bg)] border-[var(--glass-border)] text-primary rounded-xl p-3"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-brand-accent block mb-2">{t('role')}</label>
                        <input 
                            type="text" required
                            value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                            className="w-full bg-[var(--input-bg)] border-[var(--glass-border)] text-primary rounded-xl p-3"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-brand-accent block mb-2">{t('asset_url')}</label>
                        <input 
                            type="text" 
                            value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-[var(--input-bg)] border-[var(--glass-border)] text-primary rounded-xl p-3"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-brand-accent block mb-2">{t('narrative')}</label>
                        <textarea 
                            rows={6} required
                            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-[var(--input-bg)] border-[var(--glass-border)] text-primary rounded-xl p-3"
                        />
                    </div>
                    <button type="submit" className="w-full btn-primary py-4 text-black font-bold flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" /> {t('confirm_entry')}
                    </button>
                </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {members.map(member => (
          <div key={member.id} className="glass-card !bg-white/2 overflow-hidden border-[var(--glass-border)]">
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-40 aspect-square">
                <img 
                  src={member.photoUrl || 'https://via.placeholder.com/400'} 
                  className="w-full h-full object-cover" 
                  alt={member.name}
                />
              </div>
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-xl font-bold text-primary">{member.name}</h4>
                    <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold">{member.role}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(member.id)} className="p-2 text-primary/40 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-sm text-primary/50 line-clamp-3 mb-4">{member.description}</p>
                <div className="flex gap-3">
                    <input 
                        type="number" 
                        value={member.order} 
                        onChange={(e) => handleUpdate(member.id, { order: parseInt(e.target.value) })}
                        className="w-16 bg-white/5 border border-white/10 text-xs text-primary rounded px-2 py-1"
                    />
                    <span className="text-[9px] uppercase font-bold text-primary/20 self-center">Display Order</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
