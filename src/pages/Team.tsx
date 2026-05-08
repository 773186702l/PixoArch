import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, ShieldCheck, Palette, Box } from 'lucide-react';

export default function Team() {
  const { t } = useTranslation();
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const q = query(collection(db, 'team'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (members.length === 0) {
          // Mock data if Firestore is empty
          setTeam([
            {
              id: '1',
              name: 'Dr. Elias Vance',
              role: t('founder'),
              description: 'With over 20 years of experience in structural engineering and architectural visualization, Elias leads Pixo Arch with a vision of mathematical precision.',
              photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&auto=format&fit=crop',
              icon: <User className="w-5 h-5" />
            },
            {
              id: '2',
              name: 'Amira Al-Fayed',
              role: t('lead_architect'),
              description: 'Specializing in sustainable desert architecture, Amira brings a unique blend of traditional spatial design and modern minimalism.',
              photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&auto=format&fit=crop',
              icon: <Palette className="w-5 h-5" />
            },
            {
              id: '3',
              name: 'Marcus Thorne',
              role: t('viz_specialist'),
              description: 'Marcus is the master of light. His ability to transform blueprints into photo-realistic masterpieces is what sets our studio apart.',
              photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&auto=format&fit=crop',
              icon: <Box className="w-5 h-5" />
            }
          ]);
        } else {
          setTeam(members);
        }
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [t]);

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse text-2xl font-display text-primary bg-[var(--bg-primary)]">{t('loading_project')}</div>;

  return (
    <div className="pt-32 pb-24 bg-[var(--bg-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-display font-light text-primary mb-8"
          >
            {t('team_title')} <span className="text-brand-accent italic">{t('team_title_span')}</span>
          </motion.h1>
          <p className="max-w-2xl text-primary/50 text-lg md:text-xl font-light">
            {t('team_desc')}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {team.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card !border-[var(--glass-border)] group overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={member.photoUrl} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-60"></div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-brand-accent">
                    {member.icon || <ShieldCheck className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">
                    {member.role}
                  </span>
                </div>
                
                <h3 className="text-2xl font-display text-primary mb-4">{member.name}</h3>
                <p className="text-primary/50 text-sm font-light leading-relaxed">
                  {member.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
