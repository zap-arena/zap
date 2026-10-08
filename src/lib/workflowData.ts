export const workflows = [
  {
    category: "RAG",
    title: "Retrieval-Augmented Generation (RAG) Pipeline",
    steps: [
      "Ingest raw documents",
      "Split documents into chunks",
      "Generate embeddings for each chunk",
      "Store embeddings in a vector database",
      "Embed the user's query",
      "Retrieve top-matching chunks via similarity search",
      "Augment prompt with retrieved context",
      "Generate answer using the LLM",
      "Return final response to user"
    ],
    icons: ["📄", "✂️", "🔡", "🗄️", "❓", "🔎", "🧩", "🤖", "📬"],
    highLevel: ["📥 Document Ingestion & Chunking", "🔡 Embedding & Vector Indexing", "🔎 Query Retrieval", "🧩 Context-Augmented Generation", "📬 Response Delivery"]
  },
  {
    category: "Traditional AI",
    title: "Classic Machine Learning Pipeline",
    steps: [
      "Collect raw data",
      "Clean and preprocess data",
      "Engineer features",
      "Split into train/test sets",
      "Train the model",
      "Evaluate model performance",
      "Deploy model to production",
      "Monitor model in production"
    ],
    icons: ["📊", "🧹", "🛠️", "✂️", "🏋️", "📈", "🚀", "👀"],
    highLevel: ["📊 Data Collection & Cleaning", "🛠️ Feature Engineering", "🏋️ Model Training", "📈 Evaluation", "🚀 Deployment & Monitoring"]
  },
  {
    category: "Generative AI",
    title: "Generative AI Content Creation Flow",
    steps: [
      "User provides a prompt",
      "Tokenize the input",
      "Run model inference (transformer/diffusion)",
      "Decode generated tokens",
      "Post-process output (filter/format)",
      "Deliver generated content to user"
    ],
    icons: ["✍️", "🔡", "⚙️", "🔓", "🎨", "📬"],
    highLevel: ["✍️ Prompt Input", "⚙️ Model Inference", "🎨 Decoding & Post-processing", "📬 Content Delivery"]
  },
  {
    category: "Agentic AI",
    title: "Agentic AI Task Execution Loop",
    steps: [
      "Receive user goal",
      "Plan and decompose into sub-tasks",
      "Select appropriate tool/API",
      "Execute tool call",
      "Observe tool result",
      "Reflect and replan if needed",
      "Return final answer to user"
    ],
    icons: ["🎯", "🧠", "🛠️", "⚡", "👁️", "🔄", "📬"],
    highLevel: ["🎯 Goal & Planning", "🛠️ Tool Selection & Execution", "🔄 Observation & Reflection", "📬 Final Answer"]
  },
  {
    category: "LLM",
    title: "LLM Training & Alignment Pipeline",
    steps: [
      "Gather massive raw text corpus",
      "Tokenize the corpus",
      "Pretrain via next-token prediction",
      "Supervised fine-tuning on curated examples",
      "Reinforcement learning from human feedback (RLHF)",
      "Release aligned, deployable model"
    ],
    icons: ["📚", "🔡", "🏋️", "🎯", "🧭", "✅"],
    highLevel: ["📚 Corpus & Tokenization", "🏋️ Pretraining", "🎯 Fine-Tuning", "🧭 RLHF Alignment", "✅ Deployable Model"]
  },
  {
    category: "SLM",
    title: "SLM Edge Deployment Workflow",
    steps: [
      "Select a base pretrained model",
      "Apply distillation or pruning",
      "Quantize model weights",
      "Package model for the target device",
      "Deploy to edge/on-device runtime",
      "Run fast local inference offline"
    ],
    icons: ["🏗️", "✂️", "🔢", "📦", "📲", "⚡"],
    highLevel: ["🏗️ Model Selection", "✂️ Distillation & Pruning", "🔢 Quantization", "📱 Edge Packaging & Deployment"]
  },
  {
    category: "Prompting",
    title: "Prompt Engineering Iteration Flow",
    steps: [
      "Define the task clearly",
      "Choose a prompting technique (zero-shot, few-shot, CoT)",
      "Draft prompt with instructions/examples",
      "Test prompt against the model",
      "Evaluate the output quality",
      "Refine wording and structure",
      "Lock in the final production prompt"
    ],
    icons: ["🎯", "🧭", "✍️", "🧪", "📊", "🔧", "✅"],
    highLevel: ["🎯 Task Definition", "✍️ Prompt Drafting", "🧪 Testing & Evaluation", "🔧 Refinement", "✅ Final Prompt"]
  },
  {
    category: "Context Window",
    title: "Context Window Management Flow",
    steps: [
      "Receive new conversation turn",
      "Count current tokens used",
      "Compare against model's context limit",
      "Summarize or truncate oldest context if needed",
      "Merge trimmed history with new input",
      "Send final context to the model"
    ],
    icons: ["💬", "🔢", "📏", "✂️", "🔗", "📤"],
    highLevel: ["💬 Incoming Context", "📏 Token Budget Check", "✂️ Summarization/Truncation", "📤 Final Context to Model"]
  },
  {
    category: "Token Optimization",
    title: "Token Optimization Workflow",
    steps: [
      "Start with raw input text",
      "Remove redundant or filler content",
      "Summarize or compress long sections",
      "Tokenize the optimized text",
      "Check token count against budget",
      "Send the cost-efficient prompt to the model"
    ],
    icons: ["📝", "🧹", "🗜️", "🔡", "🔢", "📤"],
    highLevel: ["📝 Raw Input", "🧹 Redundancy Removal", "🗜️ Compression", "📤 Optimized Prompt"]
  },
  {
    category: "Agentic AI",
    title: "Multi-Agent Orchestration Flow",
    steps: [
      "User submits a complex request",
      "Orchestrator agent analyzes the request",
      "Route sub-tasks to specialist agents",
      "Specialist agents execute in parallel/sequence",
      "Orchestrator aggregates all results",
      "Synthesize final combined response",
      "Deliver response to user"
    ],
    icons: ["📥", "🧭", "🔀", "⚙️", "🧮", "🧩", "📤"],
    highLevel: ["📥 User Request", "🧭 Orchestrator Routing", "⚙️ Specialist Agents Execution", "🧩 Result Aggregation", "📤 Final Response"]
  },
  {
    category: "OOPs",
    title: "Class-to-Object Design Flow",
    steps: [
      "Identify a real-world entity to model",
      "Define the class blueprint",
      "Declare attributes (state/fields)",
      "Declare methods (behavior)",
      "Instantiate an object from the class",
      "Object is allocated in memory with its own state",
      "Invoke methods via the object reference"
    ],
    icons: ["🧍", "🏗️", "🧬", "⚙️", "🆕", "💾", "📞"],
    highLevel: ["🏗️ Class Definition", "🧬 Attributes & Methods", "🆕 Object Instantiation", "📞 Method Invocation"]
  },
  {
    category: "OOPs",
    title: "Inheritance Resolution Flow",
    steps: [
      "Define a base (parent) class",
      "Define a child class that extends the parent",
      "Child inherits the parent's attributes and methods",
      "Child overrides specific methods",
      "Create an object of the child class",
      "Runtime resolves which method version to call",
      "Correct overridden method executes"
    ],
    icons: ["🏛️", "🧒", "🧬", "✏️", "🆕", "🧭", "✅"],
    highLevel: ["🏛️ Parent Class", "🧒 Child Class (extends)", "✏️ Method Overriding", "🧭 Runtime Resolution"]
  },
  {
    category: "OOPs",
    title: "Encapsulation & Access Control Flow",
    steps: [
      "Define a class with private fields",
      "Expose public getter and setter methods",
      "External code calls the getter/setter",
      "Internal validation logic runs",
      "Field value is updated safely",
      "Object's internal data stays protected from direct access"
    ],
    icons: ["🔒", "🔑", "📞", "🛡️", "💾", "🔐"],
    highLevel: ["🔒 Private Fields", "🔑 Public Getters/Setters", "🛡️ Validation Logic", "🔐 Protected State"]
  },
  {
    category: "OOPs",
    title: "Polymorphism Method Dispatch Flow",
    steps: [
      "Define a common interface or abstract class",
      "Multiple classes implement/override it differently",
      "Client code references objects via the common type",
      "A concrete subclass object is created at runtime",
      "Client calls the shared method name",
      "Runtime dispatches the call to the correct subclass implementation",
      "Correct behavior is returned to the client"
    ],
    icons: ["📜", "🧩", "🧍", "🆕", "📞", "🧭", "✅"],
    highLevel: ["📜 Common Interface", "🧩 Multiple Implementations", "🧭 Runtime Dispatch", "✅ Correct Behavior Executed"]
  },
  {
    category: "OOPs",
    title: "Abstraction Design Flow",
    steps: [
      "Identify a complex system or process",
      "Define an abstract class/interface with essential operations",
      "Hide internal implementation details",
      "Concrete classes implement the specifics",
      "Client interacts only with the abstract contract",
      "Internal complexity stays hidden from the client"
    ],
    icons: ["🧠", "📜", "🙈", "🧩", "📞", "✅"],
    highLevel: ["📜 Abstract Contract", "🙈 Hidden Implementation", "🧩 Concrete Classes", "📞 Simplified Client Interaction"]
  }
];