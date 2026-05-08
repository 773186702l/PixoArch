import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Calendar, User, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const { t } = useTranslation();
  const posts = [
    {
      id: 1,
      title: 'The Future of Real-time Rendering in Architecture',
      excerpt: 'How Unreal Engine 5 is changing the way architects present their concepts to clients.',
      author: 'Elias Thorne',
      date: 'May 12, 2024',
      readTime: '6 min read',
      image: 'https://picsum.photos/seed/blog1/800/600',
      category: 'Technology'
    },
    {
      id: 2,
      title: 'Minimalism: Emotional Impact of White Spaces',
      excerpt: 'Exploring the psychology of minimalist design and how it influences residential well-being.',
      author: 'Sophia Chen',
      date: 'April 28, 2024',
      readTime: '4 min read',
      image: 'https://picsum.photos/seed/blog2/800/600',
      category: 'Design Theory'
    },
    {
      id: 3,
      title: 'Lighting the Void: Masterclass in Global Illumination',
      excerpt: 'Technical tips for achieving cinematic lighting in your architectural visualizations.',
      author: 'Marc-Antoine',
      date: 'April 15, 2024',
      readTime: '10 min read',
      image: 'https://picsum.photos/seed/blog3/800/600',
      category: 'Technical'
    }
  ];

  return (
    <div className="min-h-screen relative bg-[var(--bg-primary)]">
      <header className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="max-w-2xl px-4">
                    <h1 className="text-5xl md:text-8xl font-display font-light text-primary mb-8 leading-[0.9]">{t('blog_title')} <span className="text-brand-accent italic">{t('blog_title_span')}</span></h1>
                    <p className="text-primary/50 text-lg md:text-xl font-light">{t('blog_desc')}</p>
              </div>
              <div className="hidden md:block px-4">
                  <div className="px-6 py-3 glass-card rounded-full flex gap-6 text-[10px] font-bold text-primary/40 uppercase tracking-widest border border-[var(--glass-border)] bg-[var(--glass-bg)]">
                      <span className="text-brand-accent cursor-pointer">{t('all_categories')}</span>
                      <span className="hover:text-primary cursor-pointer transition-colors">{t('trends')}</span>
                      <span className="hover:text-primary cursor-pointer transition-colors">{t('technical')}</span>
                      <span className="hover:text-primary cursor-pointer transition-colors">{t('interviews')}</span>
                  </div>
              </div>
          </div>
      </header>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-20">
              {/* Featured Main Post */}
                <div className="relative group cursor-pointer overflow-hidden rounded-[3rem] glass-card !p-0 border-[var(--glass-border)]">
                    <div className="aspect-[21/9] overflow-hidden">
                        <img 
                            src="https://picsum.photos/seed/mainblog/1920/1080" 
                            alt="Featured" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-70 group-hover:opacity-90"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/20 to-transparent flex flex-col justify-end p-10 md:p-20">
                        <div className="max-w-3xl">
                            <span className="px-4 py-1.5 bg-brand-accent text-black rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">{t('featured_story')}</span>
                            <h2 className="text-3xl md:text-6xl font-display font-light text-primary mb-6 group-hover:text-brand-accent transition-colors leading-tight">{t('featured_title')}</h2>
                            <p className="text-primary/60 text-lg font-light mb-8 line-clamp-2">{t('featured_desc')}</p>
                            <Link to="/blog/featured" className="inline-flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-xs group">
                                {t('read_article')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-brand-accent" />
                            </Link>
                        </div>
                    </div>
                </div>

              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {posts.map((post, i) => (
                    <motion.article 
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex flex-col"
                    >
                        <div className="aspect-[16/10] overflow-hidden glass-card !rounded-3xl mb-8 relative !p-0 border-[var(--glass-border)]">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 opacity-60 group-hover:scale-110 group-hover:opacity-100" referrerPolicy="no-referrer" />
                            <div className="absolute top-4 left-4">
                                <span className="bg-brand-accent/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-brand-accent border border-brand-accent/20">
                                    {t(post.category.toLowerCase().replace(' ', '_'))}
                                </span>
                            </div>
                        </div>
                        <div className="flex-grow space-y-4 px-2">
                            <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-widest text-primary/30">
                                <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-brand-accent" /> {post.date}</div>
                                <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-brand-accent" /> {t('read_time_text', { time: post.readTime })}</div>
                            </div>
                            <h3 className="text-2xl font-display font-light text-primary group-hover:text-brand-accent transition-colors leading-tight">
                                {post.title}
                            </h3>
                            <p className="text-primary/50 font-light text-sm line-clamp-3">
                                {post.excerpt}
                            </p>
                        </div>
                        <div className="pt-8 flex items-center justify-between border-t border-[var(--glass-border)] mt-8 px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] overflow-hidden flex items-center justify-center text-[10px] font-bold text-brand-accent">
                                    {post.author.charAt(0)}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/50">{post.author}</span>
                            </div>
                            <Link to={`/blog/${post.id}`} className="p-2 glass-card hover:bg-brand-accent hover:text-black rounded-full transition-all text-primary/50 border-[var(--glass-border)]">
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.article>
                  ))}
              </div>
          </div>
      </section>

      {/* Pagination Placeholder */}
      <div className="py-20 flex justify-center items-center gap-4">
          <button className="px-6 py-2 rounded-full border border-[var(--glass-border)] text-[10px] font-bold uppercase tracking-widest text-primary/30 disabled:opacity-10 bg-[var(--glass-bg)]" disabled>{t('prev')}</button>
          <button className="w-10 h-10 rounded-full bg-brand-accent text-black text-[10px] font-bold shadow-lg shadow-brand-accent/20">1</button>
          <button className="w-10 h-10 rounded-full border border-[var(--glass-border)] text-primary/30 text-[10px] font-bold hover:bg-brand-accent/10 hover:text-primary transition-colors bg-[var(--glass-bg)]">2</button>
          <button className="px-6 py-2 rounded-full border border-[var(--glass-border)] text-[10px] font-bold uppercase tracking-widest text-primary/30 hover:bg-brand-accent/10 hover:text-primary transition-colors bg-[var(--glass-bg)]">{t('next')}</button>
      </div>
    </div>
  );
}
