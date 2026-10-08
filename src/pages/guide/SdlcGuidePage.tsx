import type React from "react";
import {
  CompareTable,
  FlowDiagram,
  InfoCards,
  SpiralDiagram,
  VModelDiagram,
} from "../../components/guide/OopsDiagrams";
import Navbar from "../../components/Navbar";
import { useGuideLogic } from "../../hooks/useGuideLogic";

export default function SdlcGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Topic navigation">
          <div className="sidebar-title">SDLC Blueprint</div>
          <div className="side-group">
            <div className="side-group-label">Foundations</div>
            <a className="side-link" href="#q1">
              01 · What is SDLC?
            </a>
            <a className="side-link" href="#q2">
              02 · The 6 Phases
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Models</div>
            <a className="side-link" href="#q3">
              03 · Waterfall Model
            </a>
            <a className="side-link" href="#q4">
              04 · Agile Methodology
            </a>
            <a className="side-link" href="#q5">
              05 · V-Model (V&amp;V)
            </a>
            <a className="side-link" href="#q6">
              06 · Spiral Model
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">SDLC</span>
              <span className="sub">Software Development Life Cycle</span>
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
              <h1>Zero to Deploy: The SDLC Blueprint</h1>
              <p>
                Six topics covering the Software Development Life Cycle — the
                structured framework teams use to design, develop, test, and
                deploy software — from its six core phases to the Waterfall,
                Agile, V-Model, and Spiral process models.
              </p>
              <div className="legend">
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={
                      {
                        background: "hsl(var(--primary))",
                      } as React.CSSProperties
                    }
                  ></span>
                  Concept &amp; diagram
                </span>
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={
                      {
                        background: "hsl(var(--primary))",
                      } as React.CSSProperties
                    }
                  ></span>
                  Interview tip
                </span>
              </div>
            </div>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>What is SDLC?</h2>
                <span className="level-badge reference">Foundation</span>
              </div>
              <p className="prompt">
                The <b>Software Development Life Cycle (SDLC)</b> is a
                structured framework used by software engineering teams to
                design, develop, test, and deploy high-quality software. It aims
                to produce software that meets customer expectations, within
                time and cost estimates.
              </p>

              <FlowDiagram
                nodes={["Raw Idea", "SDLC Process", "Final Product"]}
              />

              <div className="twist">
                <strong>Interview tip:</strong> SDLC is a{" "}
                <b>governance framework</b> — it provides a standard vocabulary
                for the team, mitigates risks, and ensures the end product
                aligns with the client's business goals.
              </div>
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>The 6 Phases of SDLC</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                While different models execute these steps in different orders,
                virtually all software development goes through these six
                fundamental phases.
              </p>

              <InfoCards
                cards={[
                  {
                    title: "1 · Requirements",
                    desc: "Gathering business needs from stakeholders, analyzing feasibility, and creating the SRS document.",
                    color: "#3b82f6",
                  },
                  {
                    title: "2 · Design",
                    desc: "Translating requirements into technical blueprints — High-Level (architecture) and Low-Level (UI/database schemas).",
                    color: "#a371f7",
                  },
                  {
                    title: "3 · Development (Coding)",
                    desc: "The longest phase. Developers write the actual code using chosen languages and frameworks.",
                    color: "#059669",
                  },
                  {
                    title: "4 · Testing",
                    desc: "QA teams rigorously test against requirements to identify and fix defects, ensuring quality and security.",
                    color: "#f85149",
                  },
                  {
                    title: "5 · Deployment",
                    desc: "Pushing the tested code into the production environment where end-users can access it.",
                    color: "#f59e0b",
                  },
                  {
                    title: "6 · Maintenance",
                    desc: "Ongoing support, fixing latent bugs, and adding minor feature enhancements over time.",
                    color: "#22d3ee",
                  },
                ]}
              />

              <div className="twist">
                <strong>Interview tip:</strong> the cost of fixing a bug
                increases exponentially the later it is found — cheap in Design,
                extremely expensive in Maintenance after users are impacted.
              </div>
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>Waterfall Model</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                The traditional, linear-sequential approach. Each phase must be
                completely finished before the next phase begins — there is no
                overlapping.
              </p>

              <FlowDiagram
                nodes={[
                  "Requirements",
                  "System Design",
                  "Implementation",
                  "Testing",
                  "Deployment",
                ]}
              />

              <div className="twist">
                <strong>Interview tip:</strong> use Waterfall only when
                requirements are strictly fixed, well understood, and highly
                unlikely to change. Its major flaw: you cannot easily go back a
                step if requirements change mid-way.
              </div>
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Agile Methodology</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                An iterative, flexible approach. Software is developed in small,
                rapid cycles called <b>Sprints</b> (usually 2-4 weeks), allowing
                teams to adapt to changing requirements continuously.
              </p>

              <FlowDiagram
                nodes={[
                  "Plan",
                  "Design",
                  "Build",
                  "Test",
                  "Review",
                  "Launch",
                  "Plan…",
                ]}
              />

              <div className="twist">
                <strong>Interview tip:</strong> "Agile isn't an excuse for zero
                documentation." It values working software <i>over</i>{" "}
                comprehensive documentation, but still requires essential
                documentation to manage technical debt.
              </div>
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>V-Model (Validation &amp; Verification)</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                An extension of Waterfall. For every development phase on the
                left side (Verification), there is a corresponding testing phase
                mapped directly to it on the right side (Validation).
              </p>

              <VModelDiagram
                pairs={[
                  { left: "Requirements", right: "User Acceptance Test" },
                  { left: "System Design", right: "System Testing" },
                  { left: "Architecture Design", right: "Integration Testing" },
                ]}
                bottom="Coding (Bottom of the V)"
              />

              <CompareTable
                headers={["Verification (Dev)", "Validation (QA)"]}
                rows={[
                  ["Requirements", "User Acceptance Test"],
                  ["System Design", "System Testing"],
                  ["Architecture Design", "Integration Testing"],
                  ["Coding (bottom of the V)", "—"],
                ]}
              />

              <div className="twist">
                <strong>Interview tip:</strong> testing planning starts on Day
                One — while developers analyze requirements, testers
                simultaneously write the User Acceptance Tests based on those
                same requirements.
              </div>
            </section>

            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>Spiral Model</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                A risk-driven model combining Waterfall and Agile. The project
                repeatedly passes through four main phases in a "spiral",
                building out from a small prototype to a large system.
              </p>

              <SpiralDiagram
                quadrants={[
                  { label: "Objective Setting & Planning", color: "#3b82f6" },
                  { label: "Risk Analysis", color: "#f85149" },
                  { label: "Develop & Test", color: "#059669" },
                  { label: "Review & Evaluate", color: "#f59e0b" },
                ]}
              />

              <InfoCards
                cards={[
                  {
                    title: "1 · Objective Setting & Planning",
                    desc: "Define objectives, alternatives, and constraints for this iteration.",
                    color: "#3b82f6",
                  },
                  {
                    title: "2 · Risk Analysis",
                    desc: "Identify and resolve risks, often through prototyping and mitigation strategies.",
                    color: "#f85149",
                  },
                  {
                    title: "3 · Develop & Test",
                    desc: "Build and verify the next version of the product for this iteration.",
                    color: "#059669",
                  },
                  {
                    title: "4 · Review & Evaluate",
                    desc: "Customer evaluates the output; plan the next iteration of the spiral.",
                    color: "#f59e0b",
                  },
                ]}
              />

              <div className="twist">
                <strong>Interview tip:</strong> the defining feature of the
                Spiral model is <b>Risk Analysis</b>. For a highly experimental,
                large, or high-risk project, the Spiral Model is the answer.
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
