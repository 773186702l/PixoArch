import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Box, Download, ZoomIn, Share2, Tag, Calendar, User, X } from 'lucide-react';

export default function ProjectDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [show3D, setShow3D] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      // Mocking for now if DB is empty
      const mockProject = {
        id: id,
        title: t('sands_villa'),
        category: t('residential'),
        description: 'A contemporary luxury villa designed to harmonize with the desert landscape. Utilizing sustainable materials and open-plan concepts to maximize natural airflow and soft light.',
        imageUrl: `https://picsum.photos/seed/p${id}/1920/1080`,
        gallery: [
            `https://picsum.photos/seed/g1_${id}/1200/800`,
            `https://picsum.photos/seed/g2_${id}/1200/800`,
            `https://picsum.photos/seed/g3_${id}/1200/800`,
        ],
        clientTestimonial: t('testimonial_1'),
        clientName: 'Modern Estates Ltd.',
        createdAt: new Date().toISOString()
      };

      try {
          const docRef = doc(db, 'projects', id!);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProject({ id: docSnap.id, ...docSnap.data() });
          } else {
            setProject(mockProject);
          }
      } catch (err) {
          setProject(mockProject);
      } finally {
          setLoading(false);
      }
    }
    fetchProject();
  }, [id, t]);

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse text-2xl font-display text-primary bg-[var(--bg-primary)]">{t('loading_project')}</div>;

  return (
    <div className="relative bg-[var(--bg-primary)]">
      {/* Project Hero */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/20 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
              <div className="max-w-7xl mx-auto">
                  <Link to="/projects" className="inline-flex items-center gap-2 text-primary/40 hover:text-primary mb-8 text-xs font-bold uppercase tracking-widest transition-colors group">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t('back_gallery')}
                  </Link>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                      <span className="px-4 py-1.5 bg-brand-accent text-black rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">
                          {project.category}
                      </span>
                      <h1 className="text-5xl md:text-8xl font-display font-light text-primary tracking-tighter mb-4">
                          {project.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-8 text-primary/40 text-[10px] font-bold uppercase tracking-widest">
                          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-accent" /> {new Date(project.createdAt).getFullYear()}</div>
                          <div className="flex items-center gap-2"><User className="w-4 h-4 text-brand-accent" /> {project.clientName}</div>
                          <div className="flex items-center gap-2 font-mono"><Tag className="w-4 h-4 text-brand-accent" /> ID: {project.id}</div>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>

      {/* Project Content */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-20">
              <div className="lg:w-2/3">
                  <h2 className="text-3xl font-display font-bold mb-8 text-primary">{t('arch_intent')}</h2>
                  <p className="text-primary/60 text-lg font-light leading-relaxed mb-12 whitespace-pre-line">
                      {project.description}
                  </p>

                  <div className="space-y-12">
                      {project.gallery?.map((img: string, idx: number) => (
                        <motion.div 
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className="glass-card !rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 aspect-video !p-0 border-[var(--glass-border)]"
                        >
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                        </motion.div>
                      ))}
                  </div>
              </div>

              <div className="lg:w-1/3">
                  <div className="sticky top-32 space-y-10">
                      <div className="glass-card p-10 !rounded-[2.5rem] border-[var(--glass-border)]">
                          <h4 className="text-brand-accent text-[10px] font-bold uppercase tracking-widest mb-6">{t('client_feedback')}</h4>
                          <blockquote className="text-xl font-display italic text-primary/80 leading-relaxed mb-6">
                              "{project.clientTestimonial || 'The level of detail in the final render allowed us to visualize the space exactly as intended.'}"
                          </blockquote>
                          <p className="font-bold text-primary leading-none">{project.clientName}</p>
                          <p className="text-[10px] text-primary/30 font-bold uppercase tracking-widest mt-2 uppercase">Head of Development</p>
                      </div>

                      <div className="flex flex-col gap-4">
                          <button 
                            onClick={() => setShow3D(true)}
                            className="w-full py-4 bg-brand-accent text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 transition-all group uppercase text-xs tracking-widest"
                          >
                              <Box className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                              {t('interact_3d')}
                          </button>
                          <button 
                            onClick={() => alert("Presentation download initiated...")}
                            className="w-full py-4 glass-card text-primary font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-[var(--glass-bg)] transition-all uppercase text-xs tracking-widest border-[var(--glass-border)]"
                          >
                              <Download className="w-5 h-5" />
                              {t('download_presentation')}
                          </button>
                          <div className="flex gap-4">
                              <button 
                                onClick={() => setIsFullscreen(true)}
                                className="flex-grow py-4 glass-card text-primary font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-[var(--glass-bg)] transition-all uppercase text-[10px] tracking-widest border-[var(--glass-border)]"
                              >
                                  <ZoomIn className="w-5 h-5" /> {t('fullscreen')}
                              </button>
                              <button 
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({ title: project.title, url: window.location.href });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert("Link copied!");
                                    }
                                }}
                                className="px-6 py-4 glass-card text-primary font-bold rounded-2xl hover:bg-[var(--glass-bg)] transition-all border-[var(--glass-border)]"
                              >
                                  <Share2 className="w-5 h-5" />
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {show3D && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            >
                <div className="relative w-full max-w-6xl aspect-video glass-card overflow-hidden !p-0">
                    <button onClick={() => setShow3D(false)} className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white"><X className="w-6 h-6" /></button>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <Box className="w-20 h-20 text-brand-accent mx-auto animate-bounce" />
                            <p className="text-white font-display text-2xl">ACTIVE 3D INTERFACE</p>
                            <p className="text-white/40 font-mono text-xs uppercase tracking-widest italic">Mock interface - Interactive viewer active</p>
                        </div>
                    </div>
                    <img src={project.imageUrl} className="w-full h-full object-cover blur-md opacity-20" alt="bg" />
                </div>
            </motion.div>
        )}

        {isFullscreen && (
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="fixed inset-0 z-[101] bg-black flex items-center justify-center"
            >
                <img src={project.imageUrl} className="w-full h-full object-contain" alt="fullscreen" />
                <button onClick={() => setIsFullscreen(false)} className="absolute top-8 right-8 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white"><X className="w-8 h-8" /></button>
            </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-24 relative">
          <div className="max-w-4xl mx-auto px-4 text-center glass-card p-20 border-[var(--glass-border)] bg-[var(--glass-bg)]">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-primary">{t('inspired_project')}</h2>
              <p className="text-primary/50 mb-10 font-light">{t('inspired_project_desc')}</p>
              <Link to="/request-project" className="px-10 py-5 btn-primary shadow-xl shadow-brand-accent/10 inline-block font-bold">{t('start_your_project')}</Link>
          </div>
      </section>
    </div>
  );
}
