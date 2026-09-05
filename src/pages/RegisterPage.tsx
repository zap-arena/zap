import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code2, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../store/auth";
import { toast } from "sonner";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const res = await register(form.name, form.email, form.password);
    setLoading(false);
    if (res.ok) {
      toast.success("Account created! Welcome to ZAP.");
      navigate("/");
    } else toast.error(res.error || "Registration failed");
  };

  return (
    <div
      className="min-h-screen flex bg-background"
      style={{ background: "var(--gradient-dark)" }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col w-1/2 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, hsl(174 100% 42% / 0.08), transparent 60%), hsl(220 18% 9%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-glow)" }}
        />
        <div className="relative z-10 flex flex-col h-full p-12 text-white">
          <div className="flex items-center gap-3 text-primary">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Code2 size={20} />
            </div>
            <span className="text-xl font-bold text-white">ZAP</span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-8">
              <div className="glow-line w-16 mb-6" />
              <h1 className="text-4xl font-bold leading-tight mb-4">
                Where code meets
                <br />
                <span className="text-primary">competition.</span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed">
                Practice algorithms, compete in contests, and track your
                progress on a platform built for serious developers.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                ["500+", "Problems"],
                ["10K+", "Developers"],
                ["200+", "Contests"],
              ].map(([val, label]) => (
                <div
                  key={label}
                  className="card-glow rounded-xl p-4 text-center bg-white/5 border border-white/10"
                >
                  <div className="text-2xl font-bold text-primary mb-1">
                    {val}
                  </div>
                  <div className="text-xs text-white/60">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-white/50">
            <span className="font-mono text-primary">// </span>
            Create your ZAP account to continue
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative bg-background">
        <Link
          to="/"
          className="absolute top-8 right-8 text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} /> Home
        </Link>
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 lg:hidden flex items-center gap-2 text-primary">
            <Code2 size={20} />
            <span className="font-bold text-lg text-foreground">ZAP</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Create your account</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Join thousands of developers on ZAP
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={form.name}
                onChange={set("name")}
                className="bg-muted border-border focus:border-primary/50 h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                className="bg-muted border-border focus:border-primary/50 h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set("password")}
                  className="bg-muted border-border focus:border-primary/50 h-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 btn-primary text-sm font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
