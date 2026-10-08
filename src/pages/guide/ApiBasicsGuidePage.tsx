import { CompareTable, FlowDiagram } from "../../components/guide/OopsDiagrams";
import Navbar from "../../components/Navbar";
import { useGuideLogic } from "../../hooks/useGuideLogic";

export default function ApiBasicsGuidePage() {
  useGuideLogic();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Topic navigation">
          <div className="sidebar-title">API Mastery</div>
          <div className="side-group">
            <div className="side-group-label">Foundations</div>
            <a className="side-link" href="#q1">
              01 · What is an API?
            </a>
            <a className="side-link" href="#q2">
              02 · What is a REST API?
            </a>
            <a className="side-link" href="#q3">
              03 · Anatomy of a Request
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Frontend & Integration</div>
            <a className="side-link" href="#q4">
              04 · Connecting from Frontend
            </a>
            <a className="side-link" href="#q5">
              05 · Third-Party APIs
            </a>
            <a className="side-link" href="#q6">
              06 · API Keys & Security
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Advanced Concepts</div>
            <a className="side-link" href="#q7">
              07 · Webhooks vs Polling
            </a>
            <a className="side-link" href="#q8">
              08 · GraphQL vs REST
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">API Mastery</span>
              <span className="sub">From Basics to Advanced Integration</span>
            </div>
          </div>

          <div className="question-nav">
            <button type="button" id="prevQuestionBtn">
              ← Previous
            </button>
            <span className="question-nav-progress" id="questionProgress" />
            <button type="button" id="nextQuestionBtn">
              Next →
            </button>
          </div>

          <div className="content">
            <div className="intro">
              <h1>The Ultimate API Guide</h1>
              <p>
                APIs are the nervous system of the modern web. This guide will
                take you from understanding what an API is, to connecting your
                frontend, to advanced architectural concepts like Webhooks and
                GraphQL.
              </p>
            </div>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>What is an API?</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                An <b>API (Application Programming Interface)</b> is a set of
                rules that allows two pieces of software to talk to each other.
                It acts as a messenger that takes your request, tells a system
                what you want to do, and returns the response back to you.
              </p>

              <div className="example">
                <b>The Restaurant Analogy:</b> Imagine you are sitting at a
                table in a restaurant (the Frontend UI) and the kitchen is the
                system that prepares the food (the Backend Database). You can't
                just walk into the kitchen. You need a <b>Waiter</b> (the API).
                You give your order (Request) to the waiter, the waiter takes it
                to the kitchen, and brings your food (Response) back to your
                table.
              </div>

              <FlowDiagram
                nodes={[
                  "Frontend (Client)",
                  "API (Waiter)",
                  "Backend (Kitchen)",
                  "Database",
                ]}
              />
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>What is a REST API?</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                <b>REST (Representational State Transfer)</b> is the most common
                architectural style for APIs. It uses standard HTTP methods to
                perform operations on "resources" (like Users or Posts).
              </p>

              <CompareTable
                headers={["HTTP Method", "CRUD Operation", "Example Usage"]}
                rows={[
                  [
                    "GET",
                    "Read",
                    "Fetch a list of Instagram posts: GET /api/posts",
                  ],
                  [
                    "POST",
                    "Create",
                    "Create a new user account: POST /api/users",
                  ],
                  [
                    "PUT / PATCH",
                    "Update",
                    "Update a user's profile picture: PUT /api/users/123",
                  ],
                  [
                    "DELETE",
                    "Delete",
                    "Delete a comment: DELETE /api/comments/456",
                  ],
                ]}
              />
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>Anatomy of an API Request & Response</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                When your frontend talks to an API, the data is usually sent and
                received in <b>JSON (JavaScript Object Notation)</b> format.
              </p>
              <div className="tabs-wrapper">
                <div className="approach-panel active">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`// 1. The Endpoint (URL)
https://api.github.com/users/vuelancer

// 2. The Request Headers
// (Metadata sent to the server, like who you are)
{
  "Authorization": "Bearer <YOUR_TOKEN>",
  "Content-Type": "application/json"
}

// 3. The JSON Response
// (What the server sends back if successful: 200 OK)
{
  "login": "vuelancer",
  "id": 123456,
  "public_repos": 42
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Connecting from the Frontend (React/JS)</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                To connect to an API from your frontend, you can use the
                built-in <code>fetch()</code> API or libraries like{" "}
                <code>axios</code>. In modern React, we often use{" "}
                <b>TanStack Query (React Query)</b> to handle caching and
                loading states automatically.
              </p>

              <div className="tabs-wrapper">
                <div className="approach-panel active">
                  <div className="complexity">Using standard async/await</div>
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`// A simple function to fetch users from a backend
async function fetchUsers() {
  try {
    // 1. Make the request
    const response = await fetch("https://api.example.com/users");
    
    // 2. Check if the response was successful (Status 200)
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    // 3. Parse the JSON data
    const data = await response.json();
    console.log(data); // Display the users in the console

  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>What is a Third-Party API?</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                While you write your own "First-Party" API for your app's
                database, a <b>Third-Party API</b> is an API provided by another
                company. It allows you to borrow their features instead of
                building them from scratch.
              </p>

              <CompareTable
                headers={["Provider", "What their API does", "Why you use it"]}
                rows={[
                  [
                    "Stripe",
                    "Payment Processing",
                    "So you don't have to legally handle credit card security yourself.",
                  ],
                  [
                    "Google Maps",
                    "Geolocation & Maps",
                    "To display an interactive map on your 'Contact Us' page.",
                  ],
                  [
                    "OpenAI",
                    "Artificial Intelligence",
                    "To add an AI chatbot to your app without training your own LLM.",
                  ],
                  [
                    "Twilio",
                    "SMS & Phone calls",
                    "To send 'Forgot Password' text messages to your users.",
                  ],
                ]}
              />
            </section>

            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>API Keys & Security (CRITICAL)</h2>
                <span className="level-badge hard">Advanced</span>
              </div>
              <p className="prompt">
                When you use a Third-Party API (like Stripe or OpenAI), they
                give you an <b>API Key</b>. This is essentially a password that
                charges your credit card every time it is used.
              </p>
              <div className="bg-muted p-4 rounded-md border-l-4 border-red-500 mt-4">
                <p className="font-bold text-red-500 mb-2">
                  NEVER PUT API KEYS IN YOUR FRONTEND CODE!
                </p>
                <p>
                  If you put your OpenAI API key in your React app (e.g.,{" "}
                  <code>
                    fetch("https://api.openai.com", {"{ "}headers: {"{ "}
                    Authorization: "Bearer sk-12345"{" }"} {"}"})
                  </code>
                  ), anyone can open their browser's Network Tab, steal your
                  key, and rack up a $10,000 bill on your account.
                  <br />
                  <br />
                  <b>The Solution:</b> The frontend should make a request to{" "}
                  <i>your own Backend</i>. Your Backend (which is secure and
                  hidden from the user) holds the API Key, makes the request to
                  OpenAI, and sends the result back to the frontend.
                </p>
              </div>
            </section>

            <section className="question" id="q7">
              <div className="q-head">
                <span className="q-index">07</span>
                <h2>Webhooks vs Polling (Real-Time APIs)</h2>
                <span className="level-badge hard">Advanced</span>
              </div>
              <p className="prompt">
                How do you know when a long-running task finishes? For example,
                when a user pays on Stripe, how does your database know the
                payment succeeded?
              </p>
              <CompareTable
                headers={["Approach", "How it works", "Analogy"]}
                rows={[
                  [
                    "Polling (The Bad Way)",
                    "Your frontend constantly asks the server 'Is it done yet?' every 3 seconds.",
                    "A kid in the backseat asking 'Are we there yet?' every minute. It wastes server resources.",
                  ],
                  [
                    "Webhooks (The Good Way)",
                    "You give the API a URL. When the task is done, the API sends a POST request to your URL automatically.",
                    "Giving a restaurant your phone number. They text you when your table is ready. Highly efficient.",
                  ],
                ]}
              />
            </section>

            <section className="question" id="q8">
              <div className="q-head">
                <span className="q-index">08</span>
                <h2>GraphQL vs REST</h2>
                <span className="level-badge hard">Advanced</span>
              </div>
              <p className="prompt">
                REST is the standard, but <b>GraphQL</b> is an alternative
                developed by Facebook to solve two massive problems:{" "}
                <b>Over-fetching</b> and <b>Under-fetching</b>.
              </p>

              <div className="tabs-wrapper">
                <div className="approach-panel active">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`The Problem with REST:
If you want to display a User's Name and their Top 3 Friends:
- Request 1: GET /users/123 (Returns 50 fields, including email/address which you didn't need. This is Over-fetching).
- Request 2: GET /users/123/friends (You have to make a whole second request. This is Under-fetching).

The GraphQL Solution:
You send one query asking ONLY for exactly what you want:

query {
  user(id: "123") {
    name
    friends(limit: 3) {
      name
    }
  }
}

The server responds with exactly that shape. No wasted data, and only one network request!`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
