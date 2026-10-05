export type ProjectStatus = "In Development" | "Active" | "Experimental" | "Coming Soon";

export type ProjectCategory = "Platform" | "Infrastructure" | "Developer Tools" | "Applications";

export interface Project {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  technologies: string[];
  thumbnail?: string;
  gallery: string[];
  features: string[];
  timeline: TimelineEvent[];
  cta: {
    label: string;
    href: string;
  };
  startedAt: string;
  updatedAt: string;
  links?: {
    github?: string;
    demo?: string;
    docs?: string;
  };
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: "milestone" | "release" | "update" | "planning";
}

export const projects: Project[] = [
  {
    slug: "nexora-works",
    name: "NEXORA WORKS",
    description: "A unified development platform that streamlines the entire software lifecycle from idea to production.",
    longDescription: "NEXORA WORKS is our flagship platform designed to eliminate friction in modern software development. It combines project management, CI/CD pipelines, code review automation, and intelligent analytics into a single cohesive experience. Built for teams that value speed without sacrificing quality.",
    category: "Platform",
    status: "In Development",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Docker", "Kubernetes", "GraphQL", "Tailwind CSS"],
    thumbnail: "/projects/nexora-works-thumb.jpg",
    gallery: [
      "/projects/nexora-works-1.jpg",
      "/projects/nexora-works-2.jpg",
      "/projects/nexora-works-3.jpg",
    ],
    features: [
      "Unified dashboard for projects, deployments, and metrics",
      "AI-powered code review assistance",
      "Automated dependency updates with confidence scoring",
      "Real-time collaboration on architecture decisions",
      "Built-in observability and performance tracking",
      "Custom workflow automation engine",
    ],
    timeline: [
      { date: "2024 Q1", title: "Concept & Research", description: "Initial research and architecture planning", type: "planning" },
      { date: "2024 Q2", title: "Core Architecture", description: "Platform foundation and data models", type: "milestone" },
      { date: "2024 Q3", title: "Alpha Release", description: "Internal alpha with core features", type: "release" },
      { date: "2024 Q4", title: "Beta Program", description: "Private beta with select teams", type: "release" },
      { date: "2025 Q1", title: "Public Launch", description: "General availability", type: "milestone" },
    ],
    cta: {
      label: "Join Waitlist",
      href: "/contact?interest=nexora-works",
    },
    startedAt: "2024-01-15",
    updatedAt: "2024-12-01",
    links: {
      github: "https://github.com/nexora-group/nexora-works",
      docs: "https://docs.nexora.group/works",
    },
  },
  {
    slug: "mgs",
    name: "MGS",
    description: "Micro-service governance system for managing distributed architectures at scale.",
    longDescription: "MGS (Micro-service Governance System) provides comprehensive tooling for service discovery, configuration management, traffic routing, and policy enforcement across distributed systems. Designed for organizations running complex micro-service architectures who need centralized control without sacrificing team autonomy.",
    category: "Infrastructure",
    status: "Active",
    technologies: ["Go", "gRPC", "NATS", "etcd", "Prometheus", "OpenTelemetry", "Envoy", "Helm"],
    thumbnail: "/projects/mgs-thumb.jpg",
    gallery: [
      "/projects/mgs-1.jpg",
      "/projects/mgs-2.jpg",
    ],
    features: [
      "Service registry with health checking",
      "Dynamic configuration with versioning",
      "Traffic splitting and canary deployments",
      "Circuit breaking and retry policies",
      "Distributed tracing integration",
      "Policy-as-code governance",
      "Multi-cluster federation",
      "GitOps-native workflows",
    ],
    timeline: [
      { date: "2023 Q3", title: "Project Initiated", description: "Internal tooling for NEXORA infrastructure", type: "planning" },
      { date: "2023 Q4", title: "v0.1 Released", description: "Core service registry and config", type: "release" },
      { date: "2024 Q1", title: "Traffic Management", description: "Canary, blue-green, and mirroring", type: "milestone" },
      { date: "2024 Q2", title: "Governance Layer", description: "Policy engine and compliance", type: "milestone" },
      { date: "2024 Q3", title: "v1.0 GA", description: "Production-ready release", type: "release" },
    ],
    cta: {
      label: "View Documentation",
      href: "https://docs.nexora.group/mgs",
    },
    startedAt: "2023-09-01",
    updatedAt: "2024-11-15",
    links: {
      github: "https://github.com/nexora-group/mgs",
      docs: "https://docs.nexora.group/mgs",
    },
  },
  {
    slug: "steve",
    name: "STEVE",
    description: "Structured Task Execution & Verification Engine — an AI-native development agent framework.",
    longDescription: "STEVE reimagines how developers interact with AI assistants. Rather than chat-based interfaces, STEVE provides structured, verifiable task execution with built-in testing, linting, and validation loops. It transforms natural language intent into typed, executable workflows that can be audited, replayed, and composed.",
    category: "Developer Tools",
    status: "Experimental",
    technologies: ["TypeScript", "Python", "Rust", "WebAssembly", "LLM APIs", "JSON Schema", "Zod", "Effect TS"],
    thumbnail: "/projects/steve-thumb.jpg",
    gallery: [
      "/projects/steve-1.jpg",
      "/projects/steve-2.jpg",
      "/projects/steve-3.jpg",
    ],
    features: [
      "Typed task definitions with schema validation",
      "Multi-model orchestration with fallback chains",
      "Automatic test generation and execution",
      "Deterministic replay for debugging",
      "Composable workflow primitives",
      "Human-in-the-loop checkpoints",
      "Cost tracking and optimization",
      "Extensible tool registry",
    ],
    timeline: [
      { date: "2024 Q1", title: "Research Phase", description: "Exploring structured AI interaction patterns", type: "planning" },
      { date: "2024 Q2", title: "Core Runtime", description: "Execution engine and type system", type: "milestone" },
      { date: "2024 Q3", title: "Agent Framework", description: "Multi-agent coordination primitives", type: "milestone" },
      { date: "2024 Q4", title: "Developer Preview", description: "Early access for selected developers", type: "release" },
    ],
    cta: {
      label: "Read Technical Blog",
      href: "/lab#steve",
    },
    startedAt: "2024-02-01",
    updatedAt: "2024-12-10",
    links: {
      github: "https://github.com/nexora-group/steve",
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByStatus(status: ProjectStatus): Project[] {
  return projects.filter((p) => p.status === status);
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((p) => p.category === category);
}

export function getAllProjects(): Project[] {
  return projects;
}

export const projectStatuses: { value: ProjectStatus; label: string; color: string }[] = [
  { value: "In Development", label: "In Development", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "Active", label: "Active", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { value: "Experimental", label: "Experimental", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { value: "Coming Soon", label: "Coming Soon", color: "bg-muted-foreground/20 text-muted-foreground border-border" },
];

export const projectCategories: { value: ProjectCategory; label: string }[] = [
  { value: "Platform", label: "Platform" },
  { value: "Infrastructure", label: "Infrastructure" },
  { value: "Developer Tools", label: "Developer Tools" },
  { value: "Applications", label: "Applications" },
];

export function getProjectStatusColor(status: ProjectStatus): string {
  switch (status) {
    case "In Development":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Active":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Experimental":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Coming Soon":
      return "bg-muted-foreground/20 text-muted-foreground border-border";
    default:
      return "bg-muted-foreground/20 text-muted-foreground border-border";
  }
}