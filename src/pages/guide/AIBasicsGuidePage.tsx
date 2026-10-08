import { CompareTable, FlowDiagram } from "../../components/guide/OopsDiagrams";
import Navbar from "../../components/Navbar";
import { useGuideLogic } from "../../hooks/useGuideLogic";

export default function AIBasicsGuidePage() {
  useGuideLogic();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Topic navigation">
          <div className="sidebar-title">AI Basics</div>
          <div className="side-group">
            <div className="side-group-label">Foundations</div>
            <a className="side-link" href="#q1">
              01 · The Evolution of AI
            </a>
            <a className="side-link" href="#q2">
              02 · What is an LLM?
            </a>
            <a className="side-link" href="#q3">
              03 · Tokens & Context Windows
            </a>
            <a className="side-link" href="#q4">
              04 · Embeddings & Vector DBs
            </a>
            <a className="side-link" href="#q5">
              05 · What is RAG?
            </a>
            <a className="side-link" href="#q6">
              06 · Fine-Tuning vs RAG
            </a>
            <a className="side-link" href="#q7">
              07 · Gen AI vs Agentic AI
            </a>
            <a className="side-link" href="#q8">
              08 · AI Guardrails
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Interview & Real-World</div>
            <a className="side-link" href="#q9">
              09 · Which are you more comfortable with?
            </a>
            <a className="side-link" href="#q10">
              10 · AI Limitations
            </a>
            <a className="side-link" href="#q11">
              11 · AI Model Parameters
            </a>
            <a className="side-link" href="#q12">
              12 · Building a Full-Scale Project
            </a>
            <a className="side-link" href="#q13">
              13 · Managing AI Prompts
            </a>
            <a className="side-link" href="#q14">
              14 · Types of Prompts
            </a>
            <a className="side-link" href="#q15">
              15 · Breaking Down Tasks
            </a>
            <a className="side-link" href="#q16">
              16 · Understanding AI Architecture
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">AI Basics</span>
              <span className="sub">Modern AI & LLM Interview Guide</span>
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
              <h1>Modern Artificial Intelligence</h1>
              <p>
                From Traditional AI to Agentic systems. This guide breaks down
                the core concepts of large language models, retrieval-augmented
                generation, safety guardrails, and how to structure, manage, and
                prompt AI when building full-scale projects in the real world.
              </p>
            </div>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>AI, Traditional AI, Generative AI, and Agentic AI</h2>
                <span className="level-badge reference">Foundation</span>
              </div>
              <p className="prompt">
                The term <b>Artificial Intelligence (AI)</b> has evolved
                significantly. Understanding the taxonomy is crucial for
                discussing modern systems.
              </p>

              <CompareTable
                headers={["Term", "Definition", "Example"]}
                rows={[
                  [
                    "Traditional AI / ML",
                    "Systems trained to recognize patterns or classify data based on rules or statistical models.",
                    "Spam filters, Netflix recommendations.",
                  ],
                  [
                    "Generative AI",
                    "Models that generate new content based on learned patterns. It stops after one output.",
                    "Typing a prompt into the standard ChatGPT text box and getting an essay back.",
                  ],
                  [
                    "Agentic AI",
                    "Autonomous systems that can plan, use tools, and loop through multiple steps to achieve a goal.",
                    "Using ChatGPT's 'Data Analysis' or 'Web Browsing': it writes code, runs it, reads the error, and fixes it by itself without you typing anything.",
                  ],
                ]}
              />
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>What is an LLM? (LLM vs SLM)</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                A <b>Large Language Model (LLM)</b> is an AI system trained on
                internet-scale text data to understand and generate human
                language. They rely on the Transformer architecture. Recently,
                the industry has split between massive, frontier <b>LLMs</b> and
                highly efficient <b>Small Language Models (SLMs)</b>.
              </p>

              <div className="example">
                ChatGPT Analogy: <b>ChatGPT</b> uses massive LLMs (like GPT-4o)
                running on supercomputers in the cloud, which is why it requires
                an internet connection. An <b>SLM</b> would be like a
                mini-ChatGPT app installed directly on your phone that works
                completely offline on airplane mode — it's fast and private, but
                won't know complex quantum physics.
              </div>

              <CompareTable
                headers={[
                  "Feature",
                  "LLM (Large Language Model)",
                  "SLM (Small Language Model)",
                ]}
                rows={[
                  [
                    "Size & Parameters",
                    "Hundreds of billions (100B - 1T+)",
                    "Few billion (1B - 8B)",
                  ],
                  [
                    "Latest Examples",
                    "GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, Llama 3.1 405B",
                    "Llama 3.2 1B/3B, Phi-3, Gemma 2 2B/9B, Qwen2.5",
                  ],
                  [
                    "Reasoning Capability",
                    "Exceptional: Complex logic, multi-step planning, broad world knowledge.",
                    "Good: Great for summarization, chat, and focused tasks, but struggles with deep logic.",
                  ],
                  [
                    "Infrastructure & Cost",
                    "Requires massive cloud GPU clusters. Expensive API costs. Higher latency.",
                    "Can run locally on a laptop (MacBook) or mobile edge device. Extremely cheap or free.",
                  ],
                  [
                    "Best Use Cases",
                    "Coding assistants, complex Agentic workflows, legal analysis, creative writing.",
                    "On-device AI, offline processing, basic customer support bots, data extraction.",
                  ],
                ]}
              />
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>Tokens & Context Windows</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                LLMs do not read words; they process <b>Tokens</b>. A token is a
                chunk of text (usually about 4 characters, or ¾ of a word in
                English). The <b>Context Window</b> is the absolute maximum
                number of tokens the model can process in a single request (both
                your input prompt + its generated output).
              </p>
              <div className="example">
                If a model has an 8,000 token context window, you cannot paste a
                10,000-word codebase into it. It will mathematically hit its
                limit and "forget" the beginning of your prompt. Modern models
                like GPT-4o have a 128k context window (a 300-page book), while
                Gemini 1.5 Pro handles up to 2 million tokens.
              </div>
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Embeddings & Vector Databases</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                How does an AI search for information? It uses <b>Embeddings</b>
                . An embedding is a way of converting text into a massive array
                of numbers (a high-dimensional vector) that mathematically
                captures the <i>semantic meaning</i> of the text. A{" "}
                <b>Vector Database</b> (like Pinecone or ChromaDB) stores and
                searches these numbers.
              </p>
              <div className="example">
                Real world: "Dog" and "Puppy" are completely different letters.
                A standard SQL database searching for "Canine" would return 0
                matches. But in a Vector Database, the numerical arrays for
                "Dog", "Puppy", and "Canine" point to the exact same area in
                multi-dimensional space, so the database knows they mean the
                same thing.
              </div>
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>What is RAG?</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                <b>RAG (Retrieval-Augmented Generation)</b> connects an LLM to
                an external knowledge base. Instead of relying solely on what it
                memorized during training, it retrieves relevant documents and
                uses them as context.
              </p>
              <div className="example">
                ChatGPT Analogy: Think of RAG like using the{" "}
                <b>"Attachment 📎"</b> button in ChatGPT to upload a PDF.
                ChatGPT hasn't memorized your specific PDF in its training data.
                Instead, it reads (retrieves) your document behind the scenes
                and uses it as context to accurately answer your questions
                (generation).
              </div>

              <FlowDiagram
                nodes={[
                  "User Query",
                  "Vector Search Database",
                  "Retrieve Context",
                  "Pass Context to LLM",
                  "Accurate Output",
                ]}
              />
            </section>

            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>Fine-Tuning vs RAG</h2>
                <span className="level-badge reference">
                  Interview Question
                </span>
              </div>
              <p className="prompt">
                A classic architectural question: When building an AI app,
                should you Fine-Tune a model or use RAG? They solve different
                problems.
              </p>
              <CompareTable
                headers={[
                  "Feature",
                  "Fine-Tuning",
                  "RAG (Retrieval-Augmented Generation)",
                ]}
                rows={[
                  [
                    "Analogy",
                    "Baking knowledge permanently into the model's 'brain'.",
                    "Giving the model an 'open textbook' during a test.",
                  ],
                  [
                    "Best Used For",
                    "Teaching the model a new tone, style, format, or a proprietary coding language syntax.",
                    "Giving the model access to specific facts, changing data, or private documents.",
                  ],
                  [
                    "Updating Data",
                    "Hard: Requires retraining the model all over again.",
                    "Easy: Just add or delete a document in your database.",
                  ],
                  [
                    "Cost & Effort",
                    "High cost, requires data science expertise.",
                    "Low cost, straightforward engineering.",
                  ],
                ]}
              />
            </section>

            <section className="question" id="q7">
              <div className="q-head">
                <span className="q-index">07</span>
                <h2>Difference between Generative AI and Agentic AI</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                While Generative AI creates, Agentic AI acts.
              </p>
              <CompareTable
                headers={["Generative AI", "Agentic AI"]}
                rows={[
                  [
                    "Passive: Waits for a prompt, gives one output.",
                    "Active: Can initiate actions, loop, and plan.",
                  ],
                  [
                    "Produces content (Text, Code, Images).",
                    "Produces actions (API calls, CLI commands, file edits).",
                  ],
                  [
                    "No memory or execution environment (by default).",
                    "Possesses state, memory, and access to tools.",
                  ],
                  [
                    "Example: 'Write a python script to fetch weather.'",
                    "Example: 'Monitor the weather and email me if it rains.' (The agent writes the script, sets up a cron job, and sends the email).",
                  ],
                ]}
              />
            </section>

            <section className="question" id="q8">
              <div className="q-head">
                <span className="q-index">08</span>
                <h2>AI Guardrails</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                <b>AI Guardrails</b> are programmable constraints or safety
                layers placed around an LLM to ensure it operates within
                ethical, safety, and business-specific boundaries.
              </p>
              <div className="example">
                Real world: If a user asks a banking customer service bot, "Who
                should I vote for in the election?", an input guardrail will
                intercept the prompt and block it before it reaches the LLM, or
                the system prompt will force the LLM to politely decline.
              </div>
              <ul className="list-disc ml-6 mt-4 space-y-2 text-muted-foreground">
                <li>
                  <b>Input Guardrails:</b> Checks the user's prompt for
                  malicious intent (e.g., prompt injection, jailbreaks) before
                  sending it to the core LLM.
                </li>
                <li>
                  <b>Output Guardrails:</b> Evaluates the LLM's response before
                  displaying it to the user (e.g., checking for toxicity, PII
                  leakage, or hallucinations).
                </li>
                <li>
                  <b>System Prompting:</b> Setting hard behavioral rules ("You
                  are a banking assistant. You must never discuss politics.").
                </li>
                <li>
                  <b>Topical Guardrails:</b> Restricting the AI's domain of
                  conversation to avoid off-topic answers that could damage
                  brand reputation.
                </li>
              </ul>
            </section>

            <section className="question" id="q9">
              <div className="q-head">
                <span className="q-index">09</span>
                <h2>
                  Which are you more comfortable with — Gen AI or Agentic AI?
                  Why?
                </h2>
                <span className="level-badge reference">
                  Interview Question
                </span>
              </div>
              <p className="prompt">
                <i>How to answer:</i> This question evaluates if you understand
                when to use simple inference vs. complex autonomous workflows.
              </p>
              <div className="bg-muted p-4 rounded-md border-l-4 border-primary mt-4">
                <p>
                  "I am highly comfortable with both, but I view them as tools
                  for different jobs.
                  <br />
                  <br />I use <b>Gen AI</b> heavily for daily developer
                  productivity—drafting boilerplate code, writing documentation,
                  or generating unit tests. It's fast and deterministic enough
                  for single-shot tasks.
                  <br />
                  <br />I am increasingly using <b>Agentic AI</b> for complex
                  automation. For instance, giving an agent access to my
                  terminal and file system to resolve a bug ticket end-to-end.
                  While Agentic AI is more powerful, it requires more careful
                  guardrails, better system prompting, and monitoring because it
                  operates autonomously. Gen AI is my 'copilot', while Agentic
                  AI is my 'junior developer'."
                </p>
              </div>
            </section>

            <section className="question" id="q10">
              <div className="q-head">
                <span className="q-index">10</span>
                <h2>
                  Can AI be used for everything? What are its limitations?
                </h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                No, AI is not a silver bullet. Understanding its limitations is
                just as important as knowing its capabilities.
              </p>
              <ul className="list-disc ml-6 mt-4 space-y-2 text-muted-foreground">
                <li>
                  <b>Hallucinations:</b> LLMs confidently present false
                  information if they lack data. They don't fundamentally "know
                  what they don't know."
                </li>
                <li>
                  <b>Context Window Limits:</b> Models can only process a
                  certain amount of text at once. You can't feed an entire
                  enterprise codebase into a prompt easily.
                </li>
                <li>
                  <b>Non-Deterministic:</b> The same input might yield a
                  different output. This makes automated testing of LLM features
                  very difficult.
                </li>
                <li>
                  <b>Lack of True Reasoning:</b> They are advanced
                  pattern-matchers predicting the next word, not conscious
                  entities performing logical deduction.
                </li>
                <li>
                  <b>Cost and Latency:</b> Running advanced models takes seconds
                  to reply and costs money per token, making it unsuitable for
                  high-frequency, real-time deterministic tasks (like ABS
                  braking in a car).
                </li>
              </ul>
            </section>

            <section className="question" id="q11">
              <div className="q-head">
                <span className="q-index">11</span>
                <h2>AI Model Parameters (Temperature, Top-P)</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                When interacting with an AI API (like OpenAI or Anthropic), you
                don't just send a prompt—you also configure parameters to
                control the model's creativity and randomness.
              </p>
              <div className="tabs-wrapper">
                <div className="approach-panel active">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`Temperature: Controls the randomness of the output (usually 0.0 to 2.0).
- 0.0: Highly deterministic. The model will almost always pick the most probable next word. Best for coding, math, and strict data extraction.
- 0.7: Balanced. Good for conversational chatbots or drafting emails.
- 1.5+: Highly creative, unpredictable, and prone to hallucinations. Best for poetry or wild brainstorming.

Top-P / Top-K: 
- Controls the pool of words the model considers. Instead of considering the entire dictionary, Top-P restricts the model to only the words that make up the top P% of probable next words.`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section className="question" id="q12">
              <div className="q-head">
                <span className="q-index">12</span>
                <h2>
                  If you had to build a full-scale project using AI, how would
                  you approach it?
                </h2>
                <span className="level-badge reference">
                  Interview Question
                </span>
              </div>
              <p className="prompt">
                <i>How to answer:</i> Emphasize a structured, iterative approach
                rather than "I would ask AI to build the whole app."
              </p>
              <div className="tabs-wrapper">
                <div className="approach-panel active">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`1. Architecture & Planning:
   - I manually design the system architecture, database schema, and tech stack.
   - I use AI as a sounding board to critique my architecture or suggest alternatives.

2. Scaffolding:
   - I use standard CLI tools (like Vite or Create-React-App) to scaffold the project reliably.

3. Iterative Generation:
   - I tackle one feature at a time. I prompt the AI to generate specific components (e.g., "Write a React component for a Login form using Tailwind").
   - I review, test, and integrate the code manually.

4. Using Agentic Tools:
   - For massive refactors or writing unit tests across 50 files, I use Agentic tools (like an IDE-integrated agent) to automate the repetitive work.

5. Human-in-the-loop:
   - I never blindly copy-paste. I remain the lead engineer; the AI is my highly efficient pair-programmer.`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section className="question" id="q13">
              <div className="q-head">
                <span className="q-index">13</span>
                <h2>
                  How would you manage AI prompts for a large project? Is one
                  prompt enough?
                </h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                One prompt is <b>never</b> enough for a large project. As
                complexity scales, single massive prompts degrade in quality
                because the LLM loses focus.
              </p>
              <ul className="list-disc ml-6 mt-4 space-y-2 text-muted-foreground">
                <li>
                  <b>Prompt Chaining:</b> Breaking down a task into sequential
                  prompts. Prompt 1 generates an outline. Prompt 2 takes the
                  outline and generates the code.
                </li>
                <li>
                  <b>System Prompts vs User Prompts:</b> Think of System Prompts
                  like the <b>"Custom Instructions"</b> setting in ChatGPT
                  (e.g., "Always write code in Python, never explain it"). It
                  sets the background rules. The User Prompt is the standard
                  message box where you type your immediate question.
                </li>
                <li>
                  <b>Prompt Libraries/Version Control:</b> Store successful,
                  complex prompts in markdown files or configuration files (like{" "}
                  <code>.cursorrules</code>) so the whole team uses the same
                  standardized instructions.
                </li>
              </ul>
            </section>

            <section className="question" id="q14">
              <div className="q-head">
                <span className="q-index">14</span>
                <h2>What kind of prompts would you use?</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Prompt Engineering involves various strategies to get the best
                output.
              </p>
              <div className="tabs-wrapper">
                <div className="approach-panel active">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`Zero-Shot Prompting:
- Asking the model to do something without giving any examples.
- "Write a python function to reverse a string."

Few-Shot Prompting:
- Providing 2-3 examples of the desired input/output format before asking the question. 
- Great for enforcing specific JSON structures or tone.

Chain-of-Thought (CoT):
- Asking the model to "think step-by-step". 
- This forces the LLM to output its reasoning before the final answer, drastically reducing logical errors in complex math or coding problems.

Role-Playing Prompts:
- "Act as a Senior Database Administrator..." This helps narrow the model's statistical weights to focus on domain-specific vocabulary and best practices.`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section className="question" id="q15">
              <div className="q-head">
                <span className="q-index">15</span>
                <h2>
                  How would you break a large project into multiple AI-assisted
                  tasks/prompts?
                </h2>
                <span className="level-badge reference">
                  Interview Question
                </span>
              </div>
              <p className="prompt">
                <i>How to answer:</i> Demonstrate modular thinking. LLMs excel
                at small, bounded contexts.
              </p>
              <div className="bg-muted p-4 rounded-md border-l-4 border-primary mt-4">
                <p>
                  "I break the project down into small, manageable pieces,
                  almost like writing an outline for an essay. I wouldn't ask
                  the AI to 'Build an E-commerce store'. Instead:
                  <br />
                  <br />
                  <b>Prompt 1:</b> 'Based on these requirements, generate a
                  database schema.'
                  <br />
                  <b>Prompt 2:</b> 'Given this schema, write the backend code to
                  handle User Login.'
                  <br />
                  <b>Prompt 3:</b> 'Write a React component for the Navigation
                  Bar that shows if the user is logged in.'
                  <br />
                  <br />
                  By isolating the context, the AI doesn't get confused,
                  hallucinate variables, or hit token limits. I then stitch
                  these modular, verified pieces together."
                </p>
              </div>
            </section>

            <section className="question" id="q16">
              <div className="q-head">
                <span className="q-index">16</span>
                <h2>
                  How to Reverse-Engineer and Understand an AI-Generated Project
                </h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                When AI generates a large codebase for you, it's easy to treat
                it as a "black box." To confidently maintain, debug, or discuss
                the project in a professional setting, you must systematically
                reverse-engineer the architecture so you genuinely understand
                it.
              </p>

              <div className="tabs-wrapper mt-4">
                <div className="approach-panel active">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`1. Map the Data Flow (The Foundation)
- Don't start by looking at complex UI code. Start with the database.
- Understand what data is being stored (e.g., Users, Posts, Comments). If you understand the data, the rest of the app makes sense.

2. Follow the Breadcrumbs (Trace a Single Feature)
- Pick one core feature (e.g., 'User Login' or 'Adding to Cart').
- Trace the flow manually: What happens when the button is clicked? Which file handles the click? Which file talks to the database?

3. Analyze the Folder Structure (The Map)
- AI usually groups code into logical folders.
- Identify where the UI components live (e.g., /components), where the pages are (/pages), and where the database logic is.

4. Break the Code Intentionally (The Sandbox)
- The fastest way to learn code you didn't write is to break it.
- Change some text, remove a line of code, or change a variable. Watch how the app breaks, then try to fix it.

5. Have the AI Explain Itself (The Tutor)
- Pass the generated code back to the AI and prompt: "Explain how this codebase works. Which file is doing what, and how does data move between them?"`}</code>
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
