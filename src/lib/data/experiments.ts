export type ExperimentCategory = "AI/ML" | "Graphics" | "Systems" | "Web" | "Research" | "Tools";

export type ExperimentStatus = "Exploring" | "Prototyping" | "Validating" | "Archived" | "Graduated";

export interface Experiment {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: ExperimentCategory;
  status: ExperimentStatus;
  technologies: string[];
  thumbnail?: string;
  gallery: string[];
  insights: string[];
  challenges: string[];
  nextSteps: string[];
  startedAt: string;
  updatedAt: string;
  links?: {
    github?: string;
    demo?: string;
    article?: string;
    paper?: string;
  };
  tags: string[];
}

export const experiments: Experiment[] = [
  {
    slug: "neural-rendering",
    name: "Neural Rendering Pipeline",
    description: "Exploring real-time neural rendering techniques for web-based 3D experiences.",
    longDescription: "Investigating the intersection of neural radiance fields (NeRFs), Gaussian splatting, and web-based rendering. The goal is to enable photorealistic 3D scenes in browsers without requiring massive downloads or specialized hardware. We're experimenting with compressed representations, progressive streaming, and hybrid traditional/neural pipelines.",
    category: "Graphics",
    status: "Prototyping",
    technologies: ["WebGPU", "WebAssembly", "Python", "PyTorch", "CUDA", "GLSL", "Three.js", "ONNX Runtime Web"],
    thumbnail: "/experiments/neural-rendering-thumb.jpg",
    gallery: [
      "/experiments/neural-rendering-1.jpg",
      "/experiments/neural-rendering-2.jpg",
    ],
    insights: [
      "WebGPU compute shaders can accelerate neural inference 10-50x vs WebGL",
      "Gaussian splatting is more web-friendly than NeRFs due to rasterization approach",
      "Model compression (quantization, distillation) is critical for web delivery",
      "Progressive loading requires careful level-of-detail design",
    ],
    challenges: [
      "Model sizes (100MB+) exceed practical web budgets",
      "WebGPU adoption still limited (~70% globally)",
      "Thermal throttling on mobile devices",
      "Cross-browser WebGPU implementation differences",
    ],
    nextSteps: [
      "Implement progressive Gaussian splatting loader",
      "Benchmark quantized models on mobile GPUs",
      "Explore WebNN for inference acceleration",
      "Publish technical write-up",
    ],
    startedAt: "2024-03-01",
    updatedAt: "2024-11-20",
    links: {
      github: "https://github.com/nexora-group/neural-rendering-web",
      article: "https://blog.nexora.group/neural-rendering-web",
    },
    tags: ["3D", "WebGPU", "ML", "Graphics", "Real-time"],
  },
  {
    slug: "local-first-sync",
    name: "Local-First Sync Protocol",
    description: "Building a conflict-free replicated data type (CRDT) based sync engine for offline-first applications.",
    longDescription: "Traditional cloud-first architectures create dependency on connectivity and centralized servers. This experiment explores a peer-to-peer synchronization protocol using CRDTs that enables true local-first applications with eventual consistency, conflict resolution, and offline capability. Target use cases: collaborative editors, mobile apps, edge computing.",
    category: "Systems",
    status: "Validating",
    technologies: ["Rust", "TypeScript", "WebRTC", "IndexedDB", "Yjs", "Automerge", "libp2p", "WASM"],
    thumbnail: "/experiments/local-first-thumb.jpg",
    gallery: [
      "/experiments/local-first-1.jpg",
      "/experiments/local-first-2.jpg",
    ],
    insights: [
      "Yjs provides excellent text CRDT but struggles with complex nested objects",
      "Automerge has better JSON-like semantics but higher memory overhead",
      "WebRTC mesh networks don't scale beyond ~10 peers without relay",
      "IndexedDB performance varies significantly across browsers",
    ],
    challenges: [
      "Garbage collection of CRDT metadata over time",
      "Schema evolution with CRDTs is non-trivial",
      "Network partition handling in peer-to-peer",
      "Mobile background sync limitations",
    ],
    nextSteps: [
      "Build schema migration tooling for Automerge",
      "Implement relay server for NAT traversal",
      "Create React hooks library for local-first state",
      "Benchmark against Firebase/Supabase Realtime",
    ],
    startedAt: "2024-01-15",
    updatedAt: "2024-12-05",
    links: {
      github: "https://github.com/nexora-group/local-first-sync",
      demo: "https://local-first-demo.nexora.group",
    },
    tags: ["CRDT", "Offline-first", "P2P", "Sync", "Distributed Systems"],
  },
  {
    slug: "code-intelligence-graph",
    name: "Code Intelligence Graph",
    description: "A semantic code graph that understands codebase structure, dependencies, and evolution patterns.",
    longDescription: "Moving beyond syntactic analysis (AST/LSP) to semantic understanding of codebases. This experiment builds a knowledge graph representing code entities (functions, types, modules), their relationships (calls, imports, types), and temporal evolution (git history). Applications: intelligent refactoring, architectural drift detection, onboarding acceleration, impact analysis.",
    category: "AI/ML",
    status: "Exploring",
    technologies: ["TypeScript", "Python", "Tree-sitter", "Neo4j", "GraphQL", "Embeddings", "LLM", "Git"],
    thumbnail: "/experiments/code-graph-thumb.jpg",
    gallery: [
      "/experiments/code-graph-1.jpg",
    ],
    insights: [
      "Static analysis + embeddings captures more semantics than either alone",
      "Git history provides crucial context for 'why' not just 'what'",
      "Graph databases (Neo4j) outperform relational for traversal queries",
      "Incremental updates are essential for large codebases",
    ],
    challenges: [
      "Cross-language analysis requires unified intermediate representation",
      "Embedding costs at scale (millions of nodes)",
      "Privacy concerns with cloud LLM APIs",
      "Keeping graph in sync with rapid code changes",
    ],
    nextSteps: [
      "Build Tree-sitter multi-language parser pipeline",
      "Experiment with local embedding models (BGE, E5)",
      "Design incremental graph update algorithm",
      "Prototype VS Code extension for visualization",
    ],
    startedAt: "2024-06-01",
    updatedAt: "2024-11-28",
    links: {
      github: "https://github.com/nexora-group/code-intelligence-graph",
    },
    tags: ["AST", "Knowledge Graph", "LLM", "Developer Tools", "Static Analysis"],
  },
  {
    slug: "react-server-components-patterns",
    name: "RSC Patterns Library",
    description: "Cataloging and validating React Server Component patterns for real-world applications.",
    longDescription: "React Server Components introduce new mental models for data fetching, composition, and interactivity boundaries. This experiment systematically explores patterns for: server/client composition, streaming strategies, cache invalidation, form handling, and progressive enhancement. Goal: establish a pattern library with trade-offs documented for each.",
    category: "Web",
    status: "Prototyping",
    technologies: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "tRPC", "PostgreSQL", "Redis"],
    thumbnail: "/experiments/rsc-patterns-thumb.jpg",
    gallery: [
      "/experiments/rsc-patterns-1.jpg",
      "/experiments/rsc-patterns-2.jpg",
    ],
    insights: [
      "Server components by default, client components by exception works well",
      "Streaming SSR with Suspense boundaries improves perceived performance",
      "Cache tagging/invalidation is the hardest part to get right",
      "Forms remain challenging — progressive enhancement pattern helps",
    ],
    challenges: [
      "Mental model shift for teams used to client-side rendering",
      "Bundle size analysis across server/client boundary",
      "Testing strategies for server components",
      "Migration from existing client-heavy apps",
    ],
    nextSteps: [
      "Document 20+ validated patterns with code examples",
      "Build interactive pattern explorer",
      "Create codemods for common migrations",
      "Publish as open-source reference",
    ],
    startedAt: "2024-04-15",
    updatedAt: "2024-12-10",
    links: {
      github: "https://github.com/nexora-group/rsc-patterns",
      article: "https://blog.nexora.group/rsc-patterns",
    },
    tags: ["React", "RSC", "Next.js", "Architecture", "Patterns"],
  },
  {
    slug: "webgpu-compute-shaders",
    name: "WebGPU Compute for Data Processing",
    description: "Leveraging GPU compute shaders in the browser for large-scale data transformation and visualization.",
    longDescription: "WebGPU brings compute shaders to the web, enabling parallel data processing on GPU. This experiment explores using compute shaders for: large dataset aggregation, real-time filtering/sorting, statistical computations, and physics simulations. Target: data-intensive dashboards, scientific visualization, and interactive analytics.",
    category: "Web",
    status: "Prototyping",
    technologies: ["WebGPU", "WGSL", "TypeScript", "Web Workers", "Arrow/Parquet", "Apache Arrow JS", "Canvas 2D/WebGL"],
    thumbnail: "/experiments/webgpu-compute-thumb.jpg",
    gallery: [
      "/experiments/webgpu-compute-1.jpg",
    ],
    insights: [
      "Compute shaders can process 10M+ rows at 60fps on modern GPUs",
      "Data transfer (CPU↔GPU) is the primary bottleneck",
      "WGSL is approachable for TypeScript developers",
      "Web Workers essential for keeping main thread responsive",
    ],
    challenges: [
      "WebGPU not available in Safari (behind flag)",
      "Memory limits on integrated graphics",
      "Debugging compute shaders is difficult",
      "Fallback strategies for non-WebGPU browsers",
    ],
    nextSteps: [
      "Build reusable compute shader library",
      "Create WebGPU + WASM hybrid fallback",
      "Benchmark against DuckDB-WASM",
      "Publish performance guide",
    ],
    startedAt: "2024-05-01",
    updatedAt: "2024-11-15",
    links: {
      github: "https://github.com/nexora-group/webgpu-compute",
      demo: "https://webgpu-compute.nexora.group",
    },
    tags: ["WebGPU", "Compute Shaders", "Data Viz", "Performance", "WGSL"],
  },
  {
    slug: "declarative-infrastructure",
    name: "Declarative Infrastructure DSL",
    description: "A domain-specific language for expressing infrastructure as typed, composable, and verifiable code.",
    longDescription: "Current IaC tools (Terraform, Pulumi, CDK) have limitations: weak typing, limited composition, poor testing, and drift detection gaps. This experiment designs a DSL with: strong dependent types, algebraic effects for side effects, formal verification hooks, and built-in simulation. Goal: infrastructure code that's as maintainable as application code.",
    category: "Tools",
    status: "Exploring",
    technologies: ["TypeScript", "Rust", "KCL", "CUE", "Dhall", "WebAssembly", "Kubernetes", "Crossplane"],
    thumbnail: "/experiments/declarative-infra-thumb.jpg",
    gallery: [],
    insights: [
      "Existing config languages (CUE, Dhall, KCL) solve different subsets",
      "Dependent types can encode infrastructure invariants (e.g., 'this port is unique')",
      "Simulation/execution duality enables safe preview",
      "Effect systems model side effects (create, delete, update) precisely",
    ],
    challenges: [
      "Learning curve for infrastructure engineers",
      "Ecosystem integration (providers, modules)",
      "Migration from existing IaC",
      "Runtime vs compile-time verification trade-offs",
    ],
    nextSteps: [
      "Prototype core type system in TypeScript",
      "Implement Kubernetes resource model",
      "Build VS Code language server",
      "Design provider plugin architecture",
    ],
    startedAt: "2024-07-01",
    updatedAt: "2024-11-01",
    links: {
      github: "https://github.com/nexora-group/declarative-infra-dsl",
    },
    tags: ["IaC", "DSL", "Types", "Kubernetes", "Verification"],
  },
];

export function getExperiment(slug: string): Experiment | undefined {
  return experiments.find((e) => e.slug === slug);
}

export function getExperimentsByCategory(category: ExperimentCategory): Experiment[] {
  return experiments.filter((e) => e.category === category);
}

export function getExperimentsByStatus(status: ExperimentStatus): Experiment[] {
  return experiments.filter((e) => e.status === status);
}

export function getAllExperiments(): Experiment[] {
  return experiments;
}

export const experimentStatuses: { value: ExperimentStatus; label: string; color: string; icon: string }[] = [
  { value: "Exploring", label: "Exploring", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: "🔍" },
  { value: "Prototyping", label: "Prototyping", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: "🛠" },
  { value: "Validating", label: "Validating", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: "✓" },
  { value: "Archived", label: "Archived", color: "bg-muted-foreground/20 text-muted-foreground border-border", icon: "📦" },
  { value: "Graduated", label: "Graduated", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: "🚀" },
];

export const experimentCategories: { value: ExperimentCategory; label: string }[] = [
  { value: "AI/ML", label: "AI/ML" },
  { value: "Graphics", label: "Graphics" },
  { value: "Systems", label: "Systems" },
  { value: "Web", label: "Web" },
  { value: "Research", label: "Research" },
  { value: "Tools", label: "Tools" },
];

export function getExperimentStatusColor(status: ExperimentStatus): string {
  switch (status) {
    case "Exploring":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Prototyping":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "Validating":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Archived":
      return "bg-muted-foreground/20 text-muted-foreground border-border";
    case "Graduated":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    default:
      return "bg-muted-foreground/20 text-muted-foreground border-border";
  }
}