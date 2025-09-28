import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/services/adminApi';
import { motion } from 'framer-motion';
import { BookOpen, Shield, Users, LineChart, Image as ImageIcon, Activity } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const resp = await adminApi.me();
        if (!mounted) return;
        setUser(resp.user || resp);
      } catch (e: any) {
        // If unauthorized, redirect to login preserving returnTo
        navigate(`/admin/login?returnTo=${encodeURIComponent(location.pathname)}`);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } finally {
      window.location.href = '/admin/login';
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="spinner" /></div>;

  if (error) return (
    <div className="container mx-auto p-6">
      <div className="text-red-600">{error}</div>
      <div className="mt-4">
        <Button onClick={() => { setError(null); setLoading(true); window.location.reload(); }}>Retry</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="bg-background/60 backdrop-blur-md border-r border-purple-500/20 p-4 md:p-6">
        <div className="font-bold text-xl mb-6">SadhanaBoard Admin</div>
        <nav className="space-y-2">
          <NavLink to="/admin" end className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'}`}>
            <LineChart className="w-4 h-4" /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'}`}>
            <Users className="w-4 h-4" /> Users
          </NavLink>
          <NavLink to="/admin/community" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'}`}>
            <Users className="w-4 h-4" /> Community
          </NavLink>
          <NavLink to="/admin/content" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'}`}>
            <ImageIcon className="w-4 h-4" /> Content
          </NavLink>
          <NavLink to="/admin/system" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'}`}>
            <Activity className="w-4 h-4" /> System
          </NavLink>
          <NavLink to="/admin/logs" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'}`}>
            <Shield className="w-4 h-4" /> Audit Logs
          </NavLink>
          <NavLink to="/admin/library" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'}`}>
            <BookOpen className="w-4 h-4" /> Library
          </NavLink>
        </nav>
        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={() => setShowLogoutConfirm(true)}>Logout</Button>
        </div>
      </aside>
      <main className="p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Outlet />
        </motion.div>
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow">
            <div className="mb-4">Are you sure you want to logout?</div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;