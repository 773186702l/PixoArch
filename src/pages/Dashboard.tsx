import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  FileText, 
  FolderKanban, 
  Bell, 
  Settings, 
  BarChart3, 
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Dashboard Sub-components
import Overview from '../components/dashboard/Overview';
import ClientRequests from '../components/dashboard/ClientRequests';
import UserSettings from '../components/dashboard/UserSettings';
import AdminProjects from '../components/dashboard/AdminProjects';
import AdminRequests from '../components/dashboard/AdminRequests';
import AdminUsers from '../components/dashboard/AdminUsers';
import AdminSettings from '../components/dashboard/AdminSettings';
import AdminTeam from '../components/dashboard/AdminTeam';

export default function Dashboard() {
  const { profile, isAdmin } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const sidebarLinks = [
    { name: t('overview'), path: '/dashboard', icon: BarChart3 },
    { name: t('my_requests'), path: '/dashboard/requests', icon: FileText },
    { name: t('notifications'), path: '/dashboard/notifications', icon: Bell },
    { name: t('profile_settings_nav'), path: '/dashboard/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: t('all_requests'), path: '/dashboard/admin/requests', icon: FileText },
    { name: t('manage_projects'), path: '/dashboard/admin/projects', icon: FolderKanban },
    { name: t('manage_team'), path: '/dashboard/admin/team', icon: Users },
    { name: t('users_control_nav'), path: '/dashboard/admin/users', icon: Users },
    { name: t('admin_settings'), path: '/dashboard/admin/settings', icon: Settings },
  ];

  const currentLinks = isAdmin ? [...sidebarLinks, ...adminLinks] : sidebarLinks;

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <aside className="w-64 glass-card !rounded-none !bg-transparent !border-none !border-r border-[var(--glass-border)] hidden lg:flex flex-col">
          <div className="p-8">
              <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-xl bg-brand-accent flex items-center justify-center text-black font-bold border border-brand-accent/20">
                      {profile?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                      <h4 className="text-sm font-bold truncate max-w-[120px] text-primary">{profile?.fullName}</h4>
                      <p className="text-[10px] text-brand-accent uppercase tracking-widest font-bold">{t('member_role', { role: t(profile?.role || 'client') })}</p>
                  </div>
              </div>

              <div className="space-y-2">
                  {currentLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        location.pathname === link.path 
                        ? 'bg-brand-accent text-black shadow-lg shadow-brand-accent/20' 
                        : 'text-primary/60 hover:bg-[var(--glass-bg)] hover:text-primary'
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.name}
                    </Link>
                  ))}
              </div>
          </div>
          <div className="mt-auto p-8 border-t border-[var(--glass-border)]">
                <div className="glass-card p-4">
                    <p className="text-[10px] uppercase font-bold text-brand-accent mb-1">{t('architecture_v')}</p>
                    <p className="text-xs text-primary/70 font-medium mb-3">{t('live_renders')}</p>
                    <Link to="/contact" className="text-xs font-bold text-brand-accent flex items-center gap-1 hover:underline">
                        {t('get_support')} <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
          </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="requests" element={<ClientRequests />} />
            <Route path="settings" element={<UserSettings />} />
            <Route path="admin/requests" element={<AdminRequests />} />
            <Route path="admin/projects" element={<AdminProjects />} />
            <Route path="admin/team" element={<AdminTeam />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/settings" element={<AdminSettings />} />
            <Route path="*" element={<div className="text-primary/50 italic">{t('page_coming_soon')}</div>} />
          </Routes>
      </main>
    </div>
  );
}
