import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Code2, Trophy, Users, Send, Activity,
  LogOut, ChevronRight, Menu, X, BarChart3
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../store/auth';
import ThemeToggle from './ThemeToggle';
import { toast } from 'sonner';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/problems', label: 'Problems', icon: Code2 },
  { path: '/admin/contests', label: 'Contests', icon: Trophy },
  { path: '/admin/participants', label: 'Participants', icon: Users },
  { path: '/admin/submissions', label: 'Submissions', icon: Send },
  { path: '/admin/logs', label: 'Exec Logs', icon: Activity },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Logged out');
    navigate('/login');
  };

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed lg:relative z-40 inset-y-0 left-0
        w-56 bg-card border-r border-border flex flex-col transition-transform duration-200
      `}>
        {/* Logo */}
        <div className="h-14 border-b border-border flex items-center px-4 gap-2 shrink-0">
          <div className="w-7 h-7 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Code2 size={14} className="text-primary" />
          </div>
          <span className="font-bold text-sm">ZAP</span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-semibold">ADMIN</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV_ITEMS.map(({ path, label, icon: Icon, exact }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`sidebar-item ${isActive(path, exact) ? 'active' : ''}`}
            >
              <Icon size={15} />
              <span>{label}</span>
              {isActive(path, exact) && <ChevronRight size={12} className="ml-auto opacity-60" />}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {user?.name?.split(' ').map(n => n[0]).join('') ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1">
            <span className="text-xs text-muted-foreground flex-1">Theme</span>
            <ThemeToggle size="xs" />
          </div>
          <button onClick={handleLogout}
            className="sidebar-item w-full text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden h-14 border-b border-border bg-card flex items-center px-4 gap-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-muted-foreground hover:text-foreground">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
