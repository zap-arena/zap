import {
  ArrowLeft,
  Server,
  Code,
  FileCode,
  PlayCircle,
  Info,
  BookOpen,
  ImageIcon,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../../guide_styles.css";

export default function DjangoReactGuidePage() {
  useEffect(() => {
    document.title = "Django + React API Integration | Guide";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
      <Navbar />

      <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col pb-20">
        <Link
          to="/curriculum/dsa"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Curriculum
        </Link>

        {/* Header */}
        <header className="mb-12 border-b border-border pb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-6">
            <Server className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            Django + React API Integration
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Learn the architecture, execution flow, and interview explanation
            for a modern high-performance Django REST Framework full-stack application.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-12">
          
          {/* Architecture Diagram */}
          <section className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-primary" /> Architecture Diagram
            </h2>
            <div className="rounded-xl overflow-hidden border border-border shadow-md">
              <img src="/django-architecture.png" alt="Django Architecture Flowchart" className="w-full object-contain" />
            </div>
            <p className="text-muted-foreground text-sm mt-4 text-center italic">
              Visual representation of the Request/Response cycle between the Browser, Django backend, and Database.
            </p>
          </section>

          {/* Basics Section */}
          <section className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" /> The Basics: Python, Django & React
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2 text-primary">🐍 Python</h3>
                <p className="text-muted-foreground text-sm">
                  A powerful, easy-to-read programming language used heavily in backend development, data science, and AI. It executes the core business logic.
                </p>
              </div>
              <div className="bg-success/5 border border-success/20 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2 text-success">🚀 Django</h3>
                <p className="text-muted-foreground text-sm">
                  A high-level Python web framework that encourages rapid development and clean, pragmatic design. Paired with Django REST Framework (DRF) to easily build powerful APIs.
                </p>
              </div>
              <div className="bg-info/5 border border-info/20 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2 text-info">⚛️ React</h3>
                <p className="text-muted-foreground text-sm">
                  A declarative, efficient, and flexible JavaScript library for building user interfaces. It fetches data from your Django backend using hooks like <code>useEffect</code>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 1 */}
          <section className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FileCode className="w-6 h-6 text-primary" /> Project Folder
              Structure
            </h2>
            <div className="bg-background border rounded-xl p-4 font-mono text-sm mb-6 text-foreground/80">
              <div className="text-primary font-bold">django_react_app/</div>
              <div className="pl-4 border-l border-border ml-2 mt-2">
                <div className="font-bold text-info mt-2">backend/ (Django)</div>
                <div className="pl-4 border-l border-border ml-2">
                  ├── views.py{" "}
                  <span className="text-muted-foreground italic ml-2">
                    # Django API Views (logic)
                  </span>
                </div>
                <div className="pl-4 border-l border-border ml-2">
                  ├── urls.py{" "}
                  <span className="text-muted-foreground italic ml-2">
                    # API endpoint routing
                  </span>
                </div>
                <div className="pl-4 border-l border-border ml-2">
                  └── requirements.txt{" "}
                  <span className="text-muted-foreground italic ml-2">
                    # Python dependencies
                  </span>
                </div>
                <div className="font-bold text-success mt-4">frontend/ (React)</div>
                <div className="pl-4 border-l border-border ml-2">
                  ├── src/
                  <div className="pl-4 border-l border-border ml-2 mt-1">
                    └── App.tsx{" "}
                    <span className="text-muted-foreground italic ml-2">
                      # React Component with fetch() inside useEffect()
                    </span>
                  </div>
                </div>
                <div className="pl-4 border-l border-border ml-2 mt-1">
                  └── package.json{" "}
                  <span className="text-muted-foreground italic ml-2">
                    # Node dependencies
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <PlayCircle className="w-6 h-6 text-primary" /> The Two Important
              Requests
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  1. Load React App
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Initial load when user visits the site, served usually by Vite or Next.js.
                </p>
                <div className="text-sm font-mono text-foreground/80 bg-background/50 p-3 rounded-lg border">
                  Browser → GET / → React/Vite → HTML/JS
                </div>
              </div>
              <div className="bg-success/5 border border-success/20 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2 text-success">
                  2. Get Data via API
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  React component mounts and fetches data from Django asynchronously.
                </p>
                <div className="text-sm font-mono text-foreground/80 bg-background/50 p-3 rounded-lg border">
                  React useEffect() → GET /api/users → Django View → JSON → React UI
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Code className="w-6 h-6 text-primary" /> Example API Integration
            </h2>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-muted-foreground">
                views.py (Django Backend)
              </div>
              <pre className="bg-card border rounded-xl p-4 overflow-x-auto text-sm font-mono">
                <code className="text-primary">from</code> rest_framework.decorators{" "}
                <code className="text-primary">import</code> api_view
                <br />
                <code className="text-primary">from</code> rest_framework.response{" "}
                <code className="text-primary">import</code> Response
                <br />
                <br />
                <code className="text-warning">@api_view</code>([
                <code className="text-success">'GET'</code>])<br />
                <code className="text-primary">def</code>{" "}
                <code className="text-info">get_users</code>(request):
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <code className="text-primary">return</code> Response([
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;
                <code className="text-success">"id"</code>: 1,{" "}
                <code className="text-success">"name"</code>:{" "}
                <code className="text-success">"Jeeva"</code>&#125;,
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;
                <code className="text-success">"id"</code>: 2,{" "}
                <code className="text-success">"name"</code>:{" "}
                <code className="text-success">"Ashwin"</code>&#125;
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;])
              </pre>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-muted-foreground">
                App.tsx (React Frontend)
              </div>
              <pre className="bg-card border rounded-xl p-4 overflow-x-auto text-sm font-mono">
                <code className="text-primary">import</code> &#123; useState, useEffect &#125; <code className="text-primary">from</code> <code className="text-success">"react"</code>;<br /><br />
                <code className="text-primary">export default function</code> <code className="text-info">UsersList</code>() &#123;<br />
                &nbsp;&nbsp;<code className="text-primary">const</code> [users, setUsers] = <code className="text-info">useState</code>([]);<br /><br />
                &nbsp;&nbsp;<code className="text-info">useEffect</code>(() =&gt; &#123;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<code className="text-info">fetch</code>(<code className="text-success">"/api/users"</code>)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<code className="text-info">then</code>(res =&gt; res.<code className="text-info">json</code>())<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<code className="text-info">then</code>(data =&gt; setUsers(data));<br />
                &nbsp;&nbsp;&#125;, []);<br /><br />
                &nbsp;&nbsp;<code className="text-primary">return</code> (<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;<code className="text-info">ul</code>&gt;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;users.map(u =&gt; &lt;<code className="text-info">li</code> key=&#123;u.id&#125;&gt;&#123;u.name&#125;&lt;/<code className="text-info">li</code>&gt;)&#125;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<code className="text-info">ul</code>&gt;<br />
                &nbsp;&nbsp;);<br />
                &#125;
              </pre>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
              <Info className="w-6 h-6" /> Interview-Ready Explanation
            </h2>
            <p className="text-foreground/90 leading-loose text-lg">
              "When a user loads our application, the browser receives the compiled React HTML and JavaScript bundle (often served by Vite or Next.js). React mounts onto the DOM and renders the initial empty UI. <br />
              <br />
              Within a React component like a UserList, we use the{" "}
              <code className="bg-background px-2 py-1 rounded border text-sm font-mono text-info">
                useEffect
              </code>{" "}
              hook to trigger a data fetch when the component first appears. We call the{" "}
              <code className="bg-background px-2 py-1 rounded border text-sm font-mono text-info">
                fetch()
              </code>{" "}
              API pointing to our backend endpoint at{" "}
              <code className="bg-background px-2 py-1 rounded border text-sm font-mono">
                /api/users
              </code>
              .<br />
              <br />
              Our backend, running on{" "}
              <code className="bg-background px-2 py-1 rounded border text-sm font-mono text-success">
                Django
              </code>
              , receives the request, hits the database, and returns the user list as JSON automatically. 
              The React app receives this JSON, calls{" "}
              <code className="bg-background px-2 py-1 rounded border text-sm font-mono text-primary">
                setUsers()
              </code>
              , which triggers a re-render, and the UI dynamically displays the users!"
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
