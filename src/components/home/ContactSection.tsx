import { useState } from "react";
import { toast } from "sonner";

export default function HomeContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", college: "", message: "", program: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Enquiry submitted! We'll reach out within 24 hours.");
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", phone: "", college: "", message: "", program: "" });
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <span className="text-primary text-xs font-mono font-medium tracking-wider uppercase">📩 Get Started</span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-foreground mb-4">
            Ready to <span className="text-gradient-primary">Level Up?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enroll today or get your college on board. Our team will reach out within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="space-y-6 mb-10">
              {[
                { icon: "📍", label: "Location", value: "Trichy, India (Online & Offline)" },
                { icon: "📞", label: "Phone", value: "+91 9080357690" },
                { icon: "📧", label: "Email", value: "praveen@codezap.in" },
                { icon: "⏰", label: "Support Hours", value: "Mon – Sat, 9 AM – 7 PM" },
              ].map((i) => (
                <div key={i.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-xl flex-shrink-0">
                    {i.icon}
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs font-mono">{i.label}</div>
                    <div className="text-foreground font-semibold text-sm">{i.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-2xl border border-primary/20 p-6">
              <div className="font-display font-bold text-foreground text-lg mb-4">Why Join Us?</div>
              {[
                "Trained by active industry professionals",
                "Structured DSA from beginner to advanced",
                "Mock interviews with real feedback",
                "Weekly contests with prize pools",
                "Gamified coding challenges",
                "College-partnered programs & certifications",
              ].map((r) => (
                <div key={r} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xs">✓</span>
                  </span>
                  <span className="text-foreground/80 text-sm">{r}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl border border-border/50 p-8 shadow-card">
            {submitted ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎉</div>
                <div className="font-display font-black text-2xl text-foreground mb-2">You're Enrolled!</div>
                <div className="text-muted-foreground">Our team will contact you within 24 hours.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="font-display font-black text-xl text-foreground mb-6">Enroll / Enquire Now</div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="home-contact-name" className="text-muted-foreground text-xs font-mono mb-1.5 block">
                      Full Name *
                    </label>
                    <input
                      id="home-contact-name"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="home-contact-phone" className="text-muted-foreground text-xs font-mono mb-1.5 block">
                      Phone *
                    </label>
                    <input
                      id="home-contact-phone"
                      required
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 ___"
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="home-contact-email" className="text-muted-foreground text-xs font-mono mb-1.5 block">
                    Email *
                  </label>
                  <input
                    id="home-contact-email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-sm transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="home-contact-college" className="text-muted-foreground text-xs font-mono mb-1.5 block">
                    College / Institution
                  </label>
                  <input
                    id="home-contact-college"
                    value={form.college}
                    onChange={(e) => setForm((f) => ({ ...f, college: e.target.value }))}
                    placeholder="NIT Surat / Other"
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-sm transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="home-contact-program" className="text-muted-foreground text-xs font-mono mb-1.5 block">
                    Program of Interest *
                  </label>
                  <select
                    id="home-contact-program"
                    required
                    value={form.program}
                    onChange={(e) => setForm((f) => ({ ...f, program: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-sm transition-all"
                  >
                    <option value="">Select a program</option>
                    <option>DSA Bootcamp (12 Weeks)</option>
                    <option>Interview Prep (6 Weeks)</option>
                    <option>Topic Courses (Self-Paced)</option>
                    <option>Coding Contests</option>
                    <option>College Partnership</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="home-contact-message" className="text-muted-foreground text-xs font-mono mb-1.5 block">
                    Message
                  </label>
                  <textarea
                    id="home-contact-message"
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us about your goals or any questions..."
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-sm transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-base shadow-glow hover:opacity-90 hover:scale-[1.01] transition-all duration-200"
                >
                  Submit Enquiry →
                </button>

                <div className="text-muted-foreground text-xs text-center">
                  🔒 Your information is secure. We'll reach out within 24 hours.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
