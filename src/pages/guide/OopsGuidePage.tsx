import type React from "react";
import {
  CompareTable,
  FlowDiagram,
  Layers,
  MergeChart,
  OrgChart,
  PillarsGrid,
  Rings,
} from "../../components/guide/OopsDiagrams";
import Navbar from "../../components/Navbar";
import { useGuideLogic } from "../../hooks/useGuideLogic";

export default function OopsGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Topic navigation">
          <div className="sidebar-title">Java OOPs Concepts</div>
          <div className="side-group">
            <div className="side-group-label">Foundations</div>
            <a className="side-link" href="#q1">
              01 · Why OOPs
            </a>
            <a className="side-link" href="#q2">
              02 · Class &amp; Object
            </a>
            <a className="side-link" href="#q3">
              03 · The Four Pillars
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Pillars In Depth</div>
            <a className="side-link" href="#q4">
              04 · Encapsulation
            </a>
            <a className="side-link" href="#q5">
              05 · Abstraction
            </a>
            <a className="side-link" href="#q6">
              06 · Inheritance &amp; Its Types
            </a>
            <a className="side-link" href="#q7">
              07 · Polymorphism
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Deep Dives</div>
            <a className="side-link" href="#q8">
              08 · Overloading vs Overriding
            </a>
            <a className="side-link" href="#q9">
              09 · Abstract Class vs Interface
            </a>
            <a className="side-link" href="#q10">
              10 · Access Modifiers
            </a>
            <a className="side-link" href="#q11">
              11 · this, super, static, final
            </a>
            <a className="side-link" href="#q12">
              12 · Constructors
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">Java OOPs</span>
              <span className="sub">Concept reference · Java</span>
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
              <h1>Java OOPs Concepts</h1>
              <p>
                Twelve topics covering everything Object-Oriented Programming in
                Java, from the basics of classes and objects to the four
                pillars, overloading vs overriding, access modifiers, and
                constructors — each with a definition, a real-world analogy,
                runnable code, and a visual diagram.
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
                  Definition &amp; real-world example
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
                  Code + visualization
                </span>
              </div>
            </div>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>Why OOPs?</h2>
                <span className="level-badge reference">Foundation</span>
              </div>
              <p className="prompt">
                Object-Oriented Programming organises software around{" "}
                <b>objects</b> instead of functions. Every object bundles{" "}
                <b>data</b> (fields) and <b>behaviour</b> (methods) into one
                unit, modelled after a real entity such as a Student, Account,
                or Vehicle.
              </p>
              <div className="example">
                Real world: your college ERP doesn't store "names" and "marks"
                as separate floating lists — it stores each Student as one unit
                owning its own name, roll number, marks, and the actions that
                can be done on them.
              </div>

              <CompareTable
                headers={[
                  "Procedural Programming",
                  "Object-Oriented Programming",
                ]}
                rows={[
                  ["Focuses on functions", "Focuses on objects"],
                  [
                    "Data and functions are separate",
                    "Data and methods live together inside the object",
                  ],
                  [
                    "Less secure (data is freely accessible)",
                    "More secure, thanks to encapsulation",
                  ],
                  [
                    "Better for small, simple programs",
                    "Better for large, evolving applications",
                  ],
                  ["Example: C", "Example: Java, C++, Python"],
                ]}
              />

              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q1-ref">
                  <div className="complexity">Advantages vs Limitations</div>
                  <div
                    className="lang-wrapper code-split"
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                  >
                    <div className="code-col">
                      <div className="code-label java">Advantages</div>
                      <pre className="code-panel">
                        <code>{`Code reusability (inheritance, polymorphism)
Easier to maintain, update, extend
Better data security (encapsulation)
Improves modularity for large apps
Reduces duplication`}</code>
                      </pre>
                    </div>
                    <div className="code-col">
                      <div className="code-label py">Limitations</div>
                      <pre className="code-panel">
                        <code>{`Steeper learning curve for beginners
Extra structure can be overkill for tiny programs
Needs upfront design and planning
Slightly higher memory/time cost`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>Class &amp; Object</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                A <b>class</b> is a user-defined blueprint that defines the
                properties and behaviours its objects will have — no memory is
                used just by writing one. An <b>object</b> is an instance of a
                class, created with <code>new</code>, that actually occupies
                memory and has state, behaviour, and identity.
              </p>
              <div className="example">
                Real world: an admission form <b>template</b> defines which
                fields exist (name, roll number, course) but isn't any
                particular student. Every <b>filled-in</b> form — Rahul's and
                Priya's — is an object of that same "Student" class.
              </div>

              <FlowDiagram
                nodes={["Class: Student", "Object: rahul", "Object: priya"]}
              />

              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q2-ref">
                  <div className="complexity">
                    One class, many objects, each with its own data
                  </div>
                  <div className="code-col">
                    <div className="code-label java">Java</div>
                    <pre className="code-panel">
                      <code>{`class Student {
    String name;
    double cgpa;

    void showProfile() {
        System.out.println(name + " - CGPA: " + cgpa);
    }
}

public class PlacementPortal {
    public static void main(String[] args) {
        Student rahul = new Student();
        rahul.name = "Rahul";
        rahul.cgpa = 8.4;

        Student priya = new Student();
        priya.name = "Priya";
        priya.cgpa = 9.1;

        rahul.showProfile();
        priya.showProfile();
    }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>Interview note:</strong> How much memory does a class
                occupy? None by itself — memory is only allocated when objects
                are created from it.
              </div>
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>The Four Pillars of OOPs</h2>
                <span className="level-badge reference">Overview</span>
              </div>
              <p className="prompt">
                These four principles are the heart of every OOPs interview and
                every well-designed Java application.
              </p>
              <PillarsGrid
                pillars={[
                  {
                    title: "Encapsulation",
                    desc: "Protect data, expose controlled access.",
                    color: "#059669",
                  },
                  {
                    title: "Abstraction",
                    desc: "Show what to do, hide how it is done.",
                    color: "#e76f51",
                  },
                  {
                    title: "Inheritance",
                    desc: "Reuse and extend existing class behaviour.",
                    color: "#f4a261",
                  },
                  {
                    title: "Polymorphism",
                    desc: "Same call, different behaviour by context.",
                    color: "#3b82f6",
                  },
                ]}
              />
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Pillar 1 — Encapsulation</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Encapsulation means binding data and the methods that act on it
                into a single unit, and restricting direct access to that data —
                in Java, by marking fields <code>private</code> and exposing
                controlled getter/setter methods.
              </p>
              <div className="example">
                Real world: a medicine capsule hides the powder inside a shell —
                you never touch it directly. Your bank balance is never edited
                directly; you only go through defined operations like deposit,
                withdraw, or check balance.
              </div>

              <FlowDiagram
                nodes={[
                  "setCgpa(8.4)",
                  "validation check",
                  "private double cgpa",
                  "getCgpa()",
                ]}
              />

              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q4-ref">
                  <div className="complexity">
                    Private field + validated getter/setter
                  </div>
                  <div className="code-col">
                    <div className="code-label java">Java</div>
                    <pre className="code-panel">
                      <code>{`class Student {
    private double cgpa; // hidden from outside world

    public void setCgpa(double cgpa) {
        if (cgpa >= 0 && cgpa <= 10) {
            this.cgpa = cgpa;
        } else {
            System.out.println("Invalid CGPA!");
        }
    }

    public double getCgpa() {
        return cgpa;
    }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>Why it matters:</strong> Encapsulation is how Java
                achieves data hiding and input validation in one place, instead
                of trusting every part of a program to set valid values
                directly.
              </div>
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>Pillar 2 — Abstraction</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Abstraction means hiding complex internal implementation details
                and showing only the essential features — achieved in Java using
                abstract classes and interfaces (see <a href="#q9">Section 9</a>
                ).
              </p>
              <div className="example">
                Real world: driving a car, you only use the steering wheel,
                accelerator and brake — you don't need to know how fuel
                injection or the gearbox works.
              </div>

              <Layers
                visible="Visible: student.applyForJob(), student.checkStatus() — simple buttons on the portal"
                hidden="Hidden: resume parsing, eligibility rules, database queries, email/SMS triggers"
              />

              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q5-ref">
                  <div className="complexity">
                    Abstract method = what; concrete method = shared how
                  </div>
                  <div className="code-col">
                    <div className="code-label java">Java</div>
                    <pre className="code-panel">
                      <code>{`abstract class PlacementProcess {
    abstract void shortlistCandidates(); // what to do - no "how" here

    void announceResult() {              // shared, already implemented
        System.out.println("Result published on portal");
    }
}

class CampusDrive extends PlacementProcess {
    @Override
    void shortlistCandidates() {
        System.out.println("Shortlisting by CGPA and test score");
    }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>Pillar 3 — Inheritance &amp; Its Types</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Inheritance lets a subclass acquire the fields and methods of a
                superclass using <code>extends</code>, modelling an{" "}
                <b>"is-a"</b> relationship. Java supports five conceptual types;
                Multiple and Hybrid inheritance are achieved only via{" "}
                <b>interfaces</b>, since a class can't <code>extends</code> two
                classes.
              </p>
              <div className="example">
                Real world: a Smartphone "is a" Phone — it inherits calling and
                SMS, then adds its own camera and apps.
              </div>

              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q6-ref">
                  <div className="complexity">Base relationship</div>
                  <div className="code-col">
                    <div className="code-label java">Java</div>
                    <pre className="code-panel">
                      <code>{`class Person {
    String name;

    void introduce() {
        System.out.println("Hi, I am " + name);
    }
}

class Student extends Person {
    int rollNumber;
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <h3 style={{ marginTop: 18 }}>
                1. Single &amp; 2. Multilevel Inheritance
              </h3>
              <FlowDiagram
                nodes={["Person", "Student", "PlacementCandidate"]}
              />
              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q6-multilevel">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`class PlacementCandidate extends Student {
    String resumeLink;
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <h3 style={{ marginTop: 18 }}>3. Hierarchical Inheritance</h3>
              <p className="prompt">
                Multiple child classes inherit from a single parent class.
              </p>
              <OrgChart
                root="Person"
                children={[
                  { label: "Student" },
                  { label: "Faculty" },
                  { label: "Admin" },
                ]}
              />

              <h3 style={{ marginTop: 18 }}>
                4. Multiple Inheritance (via Interfaces)
              </h3>
              <p className="prompt">
                A class implements more than one interface, inheriting behaviour
                contracts from each.
              </p>
              <MergeChart
                parents={["Trainable", "Placeable"]}
                child="Student"
              />
              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q6-multiple">
                  <div className="code-col">
                    <pre className="code-panel">
                      <code>{`interface Trainable {
    void attendTraining();
}

interface Placeable {
    void applyForJob();
}

class Student implements Trainable, Placeable {
    @Override
    public void attendTraining() {
        System.out.println("Attending Java bootcamp");
    }

    @Override
    public void applyForJob() {
        System.out.println("Applied to TCS, Infosys");
    }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>Diamond problem:</strong> if two parents had the same
                method, which should the child use? Java sidesteps this by not
                allowing multiple class inheritance — interfaces avoid the clash
                because implementing classes must supply their own method body.
              </div>

              <h3 style={{ marginTop: 18 }}>
                5. Hybrid Inheritance (via Interfaces)
              </h3>
              <p className="prompt">
                A combination of the types above — e.g. Hierarchical +
                Multilevel using classes, further combined with interfaces.
              </p>
              <OrgChart
                root="Person"
                children={[
                  { label: "Student", grandchildren: ["PlacementCandidate"] },
                  { label: "Faculty" },
                ]}
              />
              <div className="twist">
                Make <code>Student</code> also <code>implements Placeable</code>{" "}
                from the diagram above, and you now have Hierarchical +
                Multilevel + Multiple combined — that is{" "}
                <b>Hybrid Inheritance</b>.
              </div>
            </section>

            <section className="question" id="q7">
              <div className="q-head">
                <span className="q-index">07</span>
                <h2>Pillar 4 — Polymorphism</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Polymorphism means "many forms" — the same method name or
                reference can behave differently depending on the object or
                arguments involved.
              </p>
              <div className="example">
                Real world: a dog, a cat and a cow all "make a sound", but the
                actual sound differs for each.
              </div>

              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q7-ref">
                  <div className="code-col">
                    <div className="code-label java">Java</div>
                    <pre className="code-panel">
                      <code>{`class Animal {
    void sound() {
        System.out.println("Some generic sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Bark");
    }
}

class Cat extends Animal {
    @Override
    void sound() {
        System.out.println("Meow");
    }
}

public class Zoo {
    public static void main(String[] args) {
        Animal[] animals = { new Dog(), new Cat() };
        for (Animal a : animals) {
            a.sound();
        }
    }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <CompareTable
                headers={["Compile-Time Polymorphism", "Runtime Polymorphism"]}
                rows={[
                  ["Static / early binding", "Dynamic / late binding"],
                  [
                    "Achieved via method overloading",
                    "Achieved via method overriding",
                  ],
                  [
                    "Compiler decides the call",
                    "JVM decides the call, based on the actual object",
                  ],
                ]}
              />
              <div className="twist">
                Both forms get their own dedicated deep-dive next —{" "}
                <a href="#q8">Section 8</a>.
              </div>
            </section>

            <section className="question" id="q8">
              <div className="q-head">
                <span className="q-index">08</span>
                <h2>Method Overloading vs Method Overriding</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                <b>Overloading</b> lets a class have multiple methods with the
                same name but a different parameter list (number, type, or
                order) — changing only the return type doesn't count.{" "}
                <b>Overriding</b> happens when a subclass provides its own
                implementation of a method already defined in its parent, with
                the exact same signature; it requires inheritance and is
                resolved at runtime.
              </p>
              <div className="example">
                Real world: at a pizza counter, the action is always "Order
                Pizza" — but you can order by size, or size + toppings
                (overloading). Every Placement Trainer "conducts a session" — a
                Technical Trainer runs coding practice while a Soft-Skills
                Trainer runs group discussions (overriding).
              </div>

              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q8-overload">
                  <div className="complexity">
                    Overloading — vary number, type, or order of parameters
                  </div>
                  <div className="code-col">
                    <div className="code-label java">Java</div>
                    <pre className="code-panel">
                      <code>{`void register(String name) {
    System.out.println("Registered: " + name);
}

void register(String name, String course) {
    System.out.println(name + " -> " + course);
}

double calcFee(int students) {
    return students * 500.0;
}

double calcFee(double discount) {
    return 500 - (500 * discount);
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>No exact match?</strong> Java tries automatic type
                promotion (<code>byte → int → long → float → double</code>) to
                find a compatible overloaded method before a compile error.
              </div>

              <div className="tabs-wrapper" style={{ marginTop: 16 }}>
                <div className="approach-panel active" id="q8-override">
                  <div className="complexity">
                    Overriding — same signature, resolved at runtime via super
                  </div>
                  <div className="code-col">
                    <div className="code-label java">Java</div>
                    <pre className="code-panel">
                      <code>{`class PlacementTrainer {
    void conductSession() {
        System.out.println("Generic training session");
    }
}

class TechnicalTrainer extends PlacementTrainer {
    @Override
    void conductSession() {
        super.conductSession();              // reuse the parent's behaviour too
        System.out.println("DSA and Java coding practice");
    }
}

class SoftSkillsTrainer extends PlacementTrainer {
    @Override
    void conductSession() {
        System.out.println("Group discussion and HR rounds");
    }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <CompareTable
                headers={["Method Overloading", "Method Overriding"]}
                rows={[
                  [
                    "Same name, different parameter list",
                    "Same signature in parent and child",
                  ],
                  ["Usually within the same class", "Requires inheritance"],
                  ["Compile-time (early binding)", "Runtime (late binding)"],
                  [
                    "Compiler selects via argument types",
                    "JVM selects via actual object",
                  ],
                ]}
              />
              <div className="twist">
                <code>final</code> methods can't be overridden;{" "}
                <code>static</code> methods are hidden, not overridden
                (reference type decides); <code>private</code> methods aren't
                inherited at all. An overriding method can't be more
                restrictive, may return a covariant subtype, and can only throw
                the same, fewer, or narrower checked exceptions.
              </div>
            </section>

            <section className="question" id="q9">
              <div className="q-head">
                <span className="q-index">09</span>
                <h2>Abstract Class vs Interface</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                An <b>abstract class</b> mixes abstract methods (no body) with
                concrete methods (fully implemented, shared by subclasses), and
                can have constructors and fields. An <b>interface</b> is a pure
                contract — all methods are implicitly public and abstract
                (traditionally), and a class may implement multiple interfaces.
              </p>
              <div className="example">
                Real world: an abstract class is a resume template with common
                sections already filled in, leaving "Projects" and "Skills" for
                you. An interface is a company's eligibility criteria sheet —
                "must clear an aptitude test" — different companies run those
                rounds differently.
              </div>

              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q9-ref">
                  <div
                    className="lang-wrapper code-split"
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                  >
                    <div className="code-col">
                      <div className="code-label java">Abstract class</div>
                      <pre className="code-panel">
                        <code>{`abstract class PlacementProcess {
    abstract void shortlistCandidates();

    void announceResult() {
        System.out.println("Result published on portal");
    }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col">
                      <div className="code-label py">Interface</div>
                      <pre className="code-panel">
                        <code>{`interface Certifiable {
    void issueCertificate();
}

class BootcampDrive extends PlacementProcess implements Certifiable {
    @Override
    void shortlistCandidates() {
        System.out.println("Shortlisting by aptitude + coding test");
    }

    @Override
    public void issueCertificate() {
        System.out.println("Certificate issued");
    }
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <CompareTable
                headers={["Abstract Class", "Interface"]}
                rows={[
                  [
                    'Represents an "is-a" base with partial implementation',
                    "Represents a behaviour contract only",
                  ],
                  [
                    "Can have instance fields and constructors",
                    "No instance state; only constants",
                  ],
                  [
                    "A class can extend only one abstract class",
                    "A class can implement multiple interfaces",
                  ],
                  [
                    "Use when classes share common code",
                    "Use when unrelated classes must follow the same behaviour",
                  ],
                ]}
              />
            </section>

            <section className="question" id="q10">
              <div className="q-head">
                <span className="q-index">10</span>
                <h2>Access Modifiers</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Access modifiers control the visibility of classes, fields and
                methods — what makes encapsulation enforceable. Java has four:{" "}
                <code>private</code>, default (no modifier),{" "}
                <code>protected</code>, and <code>public</code>.
              </p>
              <div className="example">
                Real world: <code>private</code> is your personal diary, default
                is a classroom notice (own package only), <code>protected</code>{" "}
                is family information (shared with subclasses even outside the
                package), and <code>public</code> is the main college
                noticeboard.
              </div>

              <Rings
                rings={[
                  { label: "Public", color: "#58a6ff", size: 100 },
                  { label: "Protected", color: "#3fb950", size: 74 },
                  { label: "Default", color: "#f59e0b", size: 50 },
                  { label: "Private", color: "#f85149", size: 28 },
                ]}
              />

              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q10-ref">
                  <div className="code-col">
                    <div className="code-label java">Java</div>
                    <pre className="code-panel">
                      <code>{`public class Student {
    public String name;            // visible everywhere
    protected String department;   // visible to package + subclasses
    String batch;                  // default: visible in same package only
    private double cgpa;           // visible only inside this class
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <CompareTable
                headers={[
                  "Modifier",
                  "Same Class",
                  "Same Package",
                  "Subclass (Diff Package)",
                  "Other Class",
                ]}
                rows={[
                  ["public", "Yes", "Yes", "Yes", "Yes"],
                  ["protected", "Yes", "Yes", "Yes", "No"],
                  ["default", "Yes", "Yes", "No", "No"],
                  ["private", "Yes", "No", "No", "No"],
                ]}
              />
              <div className="twist">
                <strong>Memory trick:</strong> always start with the most
                restrictive access (private) and open up only as much as truly
                necessary.
              </div>
            </section>

            <section className="question" id="q11">
              <div className="q-head">
                <span className="q-index">11</span>
                <h2>this, super, static, final</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                <code>this</code> references the current object (resolving
                field/parameter name clashes, constructor chaining).{" "}
                <code>super</code> references the immediate parent (calling its
                constructor or an overridden method/field). <code>static</code>{" "}
                marks a member as belonging to the class itself, shared by all
                instances. <code>final</code> stops further change — variables
                can't be reassigned, methods can't be overridden, classes can't
                be inherited.
              </p>

              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q11-ref">
                  <div className="complexity">All four combined</div>
                  <div className="code-col">
                    <div className="code-label java">Java</div>
                    <pre className="code-panel">
                      <code>{`class PlacementCandidate {
    private String name;
    static int totalRegistered = 0;
    static final String INSTITUTE_NAME = "ABC Training Center";

    PlacementCandidate(String name) {
        this.name = name;   // 'this' removes ambiguity
        totalRegistered++;  // shared across all objects
    }

    final String getName() { // can't be overridden by a subclass
        return this.name;
    }
}

class EliteCandidate extends PlacementCandidate {
    EliteCandidate(String name) {
        super(name); // 'super': calls the parent constructor
    }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>Good to know:</strong> static methods cannot use{" "}
                <code>this</code> or <code>super</code> (there is no current
                object), and can access only other static members directly.
              </div>
            </section>

            <section className="question" id="q12">
              <div className="q-head">
                <span className="q-index">12</span>
                <h2>Constructors &amp; Constructor Overloading</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                A constructor runs automatically when an object is created with{" "}
                <code>new</code>. Its name matches the class exactly, and it has{" "}
                <b>no return type</b> — not even <code>void</code>. A class can
                overload multiple constructors with different parameter lists.
              </p>
              <div className="example">
                Real world: submitting a college admission form (
                <code>new Student(...)</code>) automatically creates and
                initialises your record — you don't fill it in field by field
                afterward.
              </div>

              <FlowDiagram
                nodes={[
                  "Student()",
                  "Student(name, batchYear)",
                  "Student(name, batchYear, course)",
                ]}
              />

              <div className="tabs-wrapper">
                <div className="approach-panel active" id="q12-ref">
                  <div className="complexity">
                    Constructor chaining with this(...)
                  </div>
                  <div className="code-col">
                    <div className="code-label java">Java</div>
                    <pre className="code-panel">
                      <code>{`class Student {
    String name;
    int batchYear;
    String course;

    Student() {
        this("Not Assigned", 2026, "General Batch");
    }

    Student(String name, int batchYear) {
        this(name, batchYear, "Java Placement Batch");
    }

    Student(String name, int batchYear, String course) {
        this.name = name;
        this.batchYear = batchYear;
        this.course = course;
    }

    Student(Student other) { // copy constructor
        this(other.name, other.batchYear, other.course);
    }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>Rule to remember:</strong> <code>this(...)</code> and{" "}
                <code>super(...)</code> must each be the <i>first statement</i>{" "}
                of a constructor, and you can never use both in the same one.
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
