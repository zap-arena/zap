import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../store/auth';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    const res = await register(form.name, form.email, form.password);
    setLoading(false);
    if (res.ok) { toast.success('Account created! Welcome to ZAP.'); navigate('/'); }
    else toast.error(res.error || 'Registration failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center gap-2 text-primary mb-8">
          <Code2 size={22} />
          <span className="font-bold text-xl">ZAP</span>
        </div>
        <h2 className="text-2xl font-bold mb-1">Create your account</h2>
        <p className="text-muted-foreground text-sm mb-8">Join thousands of developers on CodeArena</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" value={form.name} onChange={set('name')}
              className="bg-muted border-border focus:border-primary/50 h-11" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')}
              className="bg-muted border-border focus:border-primary/50 h-11" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                value={form.password} onChange={set('password')}
                className="bg-muted border-border focus:border-primary/50 h-11 pr-10" required />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-11 btn-primary text-sm font-semibold" disabled={loading}>
            {loading ? <><Loader2 size={16} className="animate-spin mr-2" />Creating account…</> : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
