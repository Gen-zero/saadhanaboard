import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/services/adminApi';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Shield, Users, LineChart, Image as ImageIcon, Palette, ScrollText } from 'lucide-react';

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi.me().then(() => {
      setIsAuthed(true);
    }).catch(() => {
      navigate('/admin/login');
    }).finally(() => setLoading(false));
  }, [navigate]);

  const logout = async () => {
    await adminApi.logout();
    navigate('/admin/login');
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!isAuthed) return null;

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
          <NavLink to="/admin/assets" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'}`}>
            <ImageIcon className="w-4 h-4" /> Assets
          </NavLink>
          <NavLink to="/admin/themes" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'}`}>
            <Palette className="w-4 h-4" /> Themes
          </NavLink>
          <NavLink to="/admin/templates" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'}`}>
            <ScrollText className="w-4 h-4" /> Templates
          </NavLink>
          <NavLink to="/admin/logs" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'}`}>
            <Shield className="w-4 h-4" /> Audit Logs
          </NavLink>
          <NavLink to="/admin/library" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-white/5'}`}>
            <BookOpen className="w-4 h-4" /> Library
          </NavLink>
        </nav>
        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={logout}>Logout</Button>
        </div>
      </aside>
      <main className="p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;


