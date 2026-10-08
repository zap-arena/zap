import { ArrowLeft, Server, Code, FileCode, PlayCircle, Info, ImageIcon } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../../guide_styles.css";

export default function FlaskApiGuidePage() {
  useEffect(() => {
    document.title = "Flask + JavaScript API Integration | Guide";
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
            Flask + JavaScript API Integration
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Learn the architecture, execution flow, and interview explanation for a template-based full-stack application.
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
              <img src="/flask-architecture.png" alt="Flask Architecture Flowchart" className="w-full object-contain" />
            </div>
            <p className="text-muted-foreground text-sm mt-4 text-center italic">
              Visual representation of the Request/Response cycle between the Browser, Flask backend, and Database.
            </p>
          </section>
          
          {/* Section 1 */}
          <section className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FileCode className="w-6 h-6 text-primary" /> Project Folder Structure
            </h2>
            <div className="bg-background border rounded-xl p-4 font-mono text-sm mb-6 text-foreground/80">
              <div className="text-primary font-bold">flask_app/</div>
              <div className="pl-4 border-l border-border ml-2 mt-2">
                <div>├── app.py <span className="text-muted-foreground italic ml-2"># Main Flask app, defines routes & APIs</span></div>
                <div className="mt-2">├── templates/</div>
                <div className="pl-4 border-l border-border ml-2">└── index.html <span className="text-muted-foreground italic ml-2"># HTML served via render_template()</span></div>
                <div className="mt-2">├── static/</div>
                <div className="pl-4 border-l border-border ml-2">└── script.js <span className="text-muted-foreground italic ml-2"># Client-side JS, uses fetch()</span></div>
                <div className="mt-2">└── requirements.txt <span className="text-muted-foreground italic ml-2"># Python dependencies</span></div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <PlayCircle className="w-6 h-6 text-primary" /> The Two Important Requests
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2 text-primary">Request 1: Get Webpage</h3>
                <p className="text-muted-foreground text-sm mb-4">Initial load when user visits the site.</p>
                <div className="text-sm font-mono text-foreground/80 bg-background/50 p-3 rounded-lg border">
                  Browser → GET / → Flask → render_template() → Browser
                </div>
              </div>
              <div className="bg-success/5 border border-success/20 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2 text-success">Request 2: Get Data</h3>
                <p className="text-muted-foreground text-sm mb-4">Async fetching to update UI dynamically.</p>
                <div className="text-sm font-mono text-foreground/80 bg-background/50 p-3 rounded-lg border">
                  JS fetch() → GET /api/users → Flask → Database → JSON → JS
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
              <div className="text-sm font-semibold text-muted-foreground">app.py (Flask Backend)</div>
              <pre className="bg-card border rounded-xl p-4 overflow-x-auto text-sm font-mono">
                <code className="text-primary">from</code> flask <code className="text-primary">import</code> Flask, jsonify, render_template<br/><br/>
                app = Flask(__name__)<br/><br/>
                <code className="text-warning">@app.route</code>(<code className="text-success">"/"</code>)<br/>
                <code className="text-primary">def</code> <code className="text-info">home</code>():<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<code className="text-primary">return</code> render_template(<code className="text-success">"index.html"</code>)<br/><br/>
                <code className="text-warning">@app.route</code>(<code className="text-success">"/api/users"</code>)<br/>
                <code className="text-primary">def</code> <code className="text-info">users</code>():<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<code className="text-primary">return</code> jsonify([<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;<code className="text-success">"id"</code>: 1, <code className="text-success">"name"</code>: <code className="text-success">"Jeeva"</code>&#125;,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;<code className="text-success">"id"</code>: 2, <code className="text-success">"name"</code>: <code className="text-success">"Ashwin"</code>&#125;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;])
              </pre>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-muted-foreground">script.js (Frontend JavaScript)</div>
              <pre className="bg-card border rounded-xl p-4 overflow-x-auto text-sm font-mono">
                <code className="text-info">fetch</code>(<code className="text-success">"/api/users"</code>)<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;.<code className="text-info">then</code>(response =&gt; response.<code className="text-info">json</code>())<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;.<code className="text-info">then</code>(data =&gt; &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.<code className="text-info">log</code>(data);<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&#125;);
              </pre>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
              <Info className="w-6 h-6" /> Interview-Ready Explanation
            </h2>
            <p className="text-foreground/90 leading-loose text-lg">
              "When the user opens the application, the browser sends a <code className="bg-background px-2 py-1 rounded border text-sm font-mono text-primary">GET</code> request to Flask. 
              Flask matches the <code className="bg-background px-2 py-1 rounded border text-sm font-mono">/</code> route and uses <code className="bg-background px-2 py-1 rounded border text-sm font-mono">render_template()</code> to return the HTML from the templates folder. 
              The browser then loads the HTML and JavaScript from the static folder. <br/><br/>
              When JavaScript needs data, it uses <code className="bg-background px-2 py-1 rounded border text-sm font-mono text-info">fetch()</code> to call a Flask API endpoint such as <code className="bg-background px-2 py-1 rounded border text-sm font-mono">/api/users</code>. 
              Flask receives the API request, performs the required business logic or database operation, and returns the result as JSON. 
              Finally, JavaScript receives that JSON and updates the UI dynamically."
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
