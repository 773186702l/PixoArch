import React, { useState, useEffect } from 'react';
import { collection, query, addDoc, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit, List, Grid, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminProjects() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Residential',
    imageUrl: '',
    description: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'projects');
    } finally {
      setLoading(false);
    }
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'projects'), {
        ...newProject,
        createdAt: new Date().toISOString()
      });
      setShowModal(false);
      setNewProject({ title: '', category: 'Residential', imageUrl: '', description: '' });
      fetchProjects();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm(t('confirm_delete_project'))) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  return (
    <div className="space-y-8 text-primary">
      <div className="flex justify-between items-center">
          <div>
              <h1 className="text-4xl font-display font-light text-primary mb-2">{t('gallery_mgmt')}.</h1>
              <p className="text-primary/50 text-sm">{t('gallery_desc')}</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary px-8 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-brand-accent/20"
          >
            <Plus className="w-4 h-4 text-black" />
            {t('add_project')}
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {projects.map((p, i) => (
             <motion.div 
                key={p.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden group border-[var(--glass-border)] active:scale-95 transition-all"
             >
                <div className="aspect-[4/3] relative">
                    <img src={p.imageUrl || 'https://picsum.photos/seed/pixo/400/400'} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-[var(--bg-primary)]/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                        <button className="p-3 bg-brand-accent text-black rounded-full hover:scale-110 transition-transform"><Edit className="w-4 h-4" /></button>
                        <button 
                            onClick={() => deleteProject(p.id)}
                            className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em] mb-2 block">{t(p.category.toLowerCase())}</span>
                    <h4 className="font-bold text-primary truncate text-sm tracking-tight">{p.title}</h4>
                </div>
             </motion.div>
          ))}
          {projects.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-[var(--glass-border)] rounded-[2.5rem]">
                  <ImageIcon className="w-12 h-12 text-primary/10 mx-auto mb-4" />
                  <p className="text-primary/30 text-sm italic font-mono">{t('no_projects_vault')}</p>
              </div>
          )}
      </div>

      <AnimatePresence>
        {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={() => setShowModal(false)}
                    className="absolute inset-0 bg-[var(--bg-primary)]/95 backdrop-blur-xl"
                ></motion.div>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="glass-card w-full max-w-xl p-12 relative z-10 !bg-[var(--bg-primary)] border-[var(--glass-border)] overflow-y-auto max-h-[90vh]"
                >
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-3 bg-brand-accent/20 rounded-xl">
                            <Plus className="w-6 h-6 text-brand-accent" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-display font-light text-primary">{t('create_artifact').split(' ')[0]} <span className="text-brand-accent italic">{t('create_artifact').split(' ').slice(1).join(' ')}</span></h2>
                            <p className="text-[10px] uppercase font-bold text-primary/30 tracking-widest mt-1">{t('public_collection')}</p>
                        </div>
                    </div>

                    <form onSubmit={handleAddProject} className="space-y-8 text-primary">
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent">{t('project_title_label')}</label>
                            <input 
                                type="text" 
                                value={newProject.title}
                                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                                className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]" 
                                placeholder="e.g. OXY Residential Villa"
                                required 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent">{t('classification')}</label>
                            <select 
                                value={newProject.category}
                                onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                                className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]"
                            >
                                <option className="bg-[var(--bg-primary)] text-primary" value="Residential">{t('residential')}</option>
                                <option className="bg-[var(--bg-primary)] text-primary" value="Commercial">{t('commercial')}</option>
                                <option className="bg-[var(--bg-primary)] text-primary" value="Interior">{t('interior')}</option>
                                <option className="bg-[var(--bg-primary)] text-primary" value="Urban">{t('urban')}</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent">{t('asset_url')}</label>
                            <input 
                                type="url" 
                                value={newProject.imageUrl}
                                onChange={(e) => setNewProject({...newProject, imageUrl: e.target.value})}
                                className="w-full bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]" 
                                placeholder="Direct HTTPS image link" 
                                required
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent">{t('narrative')}</label>
                            <textarea 
                                value={newProject.description}
                                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                className="w-full h-32 bg-[var(--input-bg)] text-[var(--input-text)] border-[var(--glass-border)]" 
                                placeholder="Optional description..."
                            />
                        </div>
                        <div className="pt-6 flex gap-4">
                            <button type="submit" disabled={loading} className="btn-primary flex-grow py-5 text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-brand-accent/10">
                                {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : (
                                    <span className="flex items-center justify-center gap-2 text-black">
                                        {t('confirm_entry')} <Sparkles className="w-4 h-4" />
                                    </span>
                                )}
                            </button>
                            <button type="button" onClick={() => setShowModal(false)} className="px-8 py-5 border border-[var(--glass-border)] text-primary/50 text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-white/5 transition-all">{t('cancel')}</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
