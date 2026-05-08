import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Search, Grid, List as ListIcon, ArrowRight, Home, Building2, Palmtree, Map as MapIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Projects() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState<'grid' | 'carousel'>('grid');

  const categories = [
    { name: 'All', label: t('all_categories'), icon: Home },
    { name: 'Residential', label: t('residential'), icon: Home },
    { name: 'Commercial', label: t('commercial'), icon: Building2 },
    { name: 'Interior', label: t('interior'), icon: Palmtree },
    { name: 'Urban', label: t('urban'), icon: MapIcon },
  ];

  useEffect(() => {
    async function fetchProjects() {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Mock projects if none in DB yet
  const displayProjects = projects.length > 0 ? filteredProjects : [
    { id: '1', title: 'The Sands Villa', category: 'Residential', imageUrl: 'https://picsum.photos/seed/p1/800/1000' },
    { id: '2', title: 'Skyline Plaza', category: 'Commercial', imageUrl: 'https://picsum.photos/seed/p2/800/1000' },
    { id: '3', title: 'Luxe Loft', category: 'Interior', imageUrl: 'https://picsum.photos/seed/p3/800/1000' },
    { id: '4', title: 'Green Park Hub', category: 'Urban', imageUrl: 'https://picsum.photos/seed/p4/800/1000' },
    { id: '5', title: 'Azure Retreat', category: 'Residential', imageUrl: 'https://picsum.photos/seed/p5/800/1000' },
    { id: '6', title: 'Nexus Office', category: 'Commercial', imageUrl: 'https://picsum.photos/seed/p6/800/1000' },
  ].filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-20 relative">
      <header className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-8xl font-display font-light text-primary mb-6">{t('gallery_title')}.</h1>
            <p className="text-primary/50 text-lg md:text-xl font-light">{t('gallery_desc_page')}</p>
          </div>
      </header>

      {/* Filters & Controls */}
      <div className="sticky top-20 z-40 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-6 glass-card !rounded-2xl mx-4 sm:mx-auto border-[var(--glass-border)] !bg-[var(--bg-primary)]/80 backdrop-blur-xl">
              <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                  {categories.map((cat) => (
                    <button
                        key={cat.name}
                        onClick={() => setFilter(cat.name)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                            filter === cat.name 
                            ? 'bg-brand-accent text-black shadow-lg shadow-brand-accent/20' 
                            : 'bg-[var(--glass-bg)] text-primary/40 hover:bg-brand-accent/10 hover:text-primary border border-[var(--glass-border)]'
                        }`}
                    >
                        <cat.icon className="w-3.5 h-3.5" />
                        {cat.label}
                    </button>
                  ))}
              </div>

              <div className="flex items-center gap-4">
                  <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 group-focus-within:text-brand-accent" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('search_projects')} 
                        className="pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--glass-border)] rounded-xl text-sm text-primary focus:border-brand-accent outline-none transition-all w-64"
                      />
                  </div>
                  <div className="flex items-center p-1 bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)]">
                      <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-brand-accent text-black' : 'text-primary/40'}`}><Grid className="w-4 h-4" /></button>
                      <button onClick={() => setView('carousel')} className={`p-2 rounded-lg transition-colors ${view === 'carousel' ? 'bg-brand-accent text-black' : 'text-primary/40'}`}><ListIcon className="w-4 h-4" /></button>
                  </div>
              </div>
          </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            layout
            className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" : "flex flex-col gap-8"}
          >
              <AnimatePresence mode="popLayout">
                {displayProjects.map((project) => (
                    <motion.div
                        layout
                        key={project.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className={view === 'grid' ? "group relative" : "group relative flex flex-col md:flex-row items-center gap-8 glass-card p-6"}
                    >
                        <div className={`${view === 'grid' ? 'aspect-[4/5] w-full' : 'aspect-square w-full md:w-64'} glass-card overflow-hidden mb-6 md:mb-0 relative !p-0 border-[var(--glass-border)]`}>
                            <img 
                                src={project.imageUrl} 
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100" 
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                            <div className="absolute top-6 left-6 flex gap-2">
                                <span className="px-3 py-1 bg-brand-accent/20 backdrop-blur-md rounded-full text-[10px] font-bold text-brand-accent uppercase tracking-widest border border-brand-accent/20">
                                    {t(project.category.toLowerCase())}
                                </span>
                            </div>
                        </div>
                        <div className={`flex justify-between items-start ${view === 'grid' ? 'px-4' : 'flex-grow'}`}>
                            <div>
                                <h3 className={`${view === 'grid' ? 'text-2xl' : 'text-3xl md:text-4xl'} font-display font-light text-primary mb-1 hover:text-brand-accent transition-colors leading-none mb-2 mt-4 md:mt-0`}>
                                    <Link to={`/projects/${project.id}`}>{project.title}</Link>
                                </h3>
                                <p className="text-[10px] text-primary/40 font-bold uppercase tracking-[0.2em]">Architecture v.Render</p>
                                {view === 'carousel' && (
                                  <p className="text-primary/60 mt-4 max-w-xl font-light">
                                    An architectural masterpiece pushing the boundaries of modern visualization and spatial design.
                                  </p>
                                )}
                            </div>
                            <Link to={`/projects/${project.id}`} className="p-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] text-primary rounded-full hover:bg-brand-accent hover:text-black transition-all transform hover:scale-110 active:scale-95">
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
              </AnimatePresence>
          </motion.div>
      </div>

      {/* Newsletter */}
      <section className="mt-40 max-w-7xl mx-auto px-4">
          <div className="glass-card !bg-brand-accent p-12 md:p-20 text-center relative overflow-hidden group border-none">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Search className="w-64 h-64 text-black" />
              </div>
              <h2 className="text-4xl md:text-7xl font-display font-bold text-black mb-8 relative z-10">{t('stay_inspired')}</h2>
              <p className="text-black/60 mb-12 max-w-xl mx-auto text-lg font-medium relative z-10 leading-relaxed">{t('newsletter_desc')}</p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10">
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="flex-grow px-8 py-5 bg-white rounded-2xl outline-none shadow-2xl shadow-black/10 text-black font-semibold"
                    />
                    <button className="px-10 py-5 bg-black text-white font-bold rounded-2xl hover:brightness-125 transition-all uppercase tracking-widest text-xs">{t('join')}</button>
              </form>
          </div>
      </section>
    </div>
  );
}
