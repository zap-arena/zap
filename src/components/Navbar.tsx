import { Link, useNavigate } from 'react-router-dom';
import { Code2, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../store/auth';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 gap-4 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg shrink-0">
        <div className="w-7 h-7 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Code2 size={14} className="text-primary" />
        </div>
        <span className="hidden sm:block">ZAP</span>
      </Link>

      <div className="flex gap-4 items-center pl-4">
        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Home
        </Link>
        <Link to="/contests" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Contests
        </Link>
      </div>

      <div className="flex-1" />

      <ThemeToggle />

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {user.name.split(' ').map(n => n[0]?.toUpperCase()).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block font-medium text-sm">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border">
            {user.role === 'admin' && (
              <DropdownMenuItem onClick={() => navigate('/admin')} className="gap-2 cursor-pointer">
                <LayoutDashboard size={14} /> Admin Dashboard
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => navigate('/profile')} className="gap-2 cursor-pointer">
              <User size={14} /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive cursor-pointer">
              <LogOut size={14} /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
          <Button size="sm" className="btn-primary" onClick={() => navigate('/register')}>Sign Up</Button>
        </div>
      )}
    </nav>
  );
}
