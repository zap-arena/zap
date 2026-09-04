import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    // Simulate API call to backend mock endpoint
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Reset link sent!');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 auth-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Zap className="text-primary" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Code<span className="text-primary">Arena</span>
            </span>
          </Link>
        </div>

        <div className="card-glow rounded-2xl p-8 backdrop-blur-sm border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />

          <div className="relative">
            {submitted ? (
              <div className="text-center space-y-6 animate-fade-in">
                <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">Check your email</h1>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We've sent a password reset link to <br />
                    <span className="text-foreground font-medium">{email}</span>
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground border border-border/50 text-left">
                  <p className="font-semibold mb-1 text-foreground">
                    Development Note:
                  </p>
                  Since SMTP is not configured in this demo, no actual email was
                  sent. This is a mock UI flow.
                </div>
                <Button
                  asChild
                  className="w-full font-semibold h-11"
                  variant="outline"
                >
                  <Link to="/login">Return to Login</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                  <p className="text-muted-foreground text-sm">
                    Enter your email and we'll send you a reset link
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground pl-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Mail size={16} />
                      </div>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-semibold h-11 mt-2"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
