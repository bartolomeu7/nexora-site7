export type ProductCategory = "Templates" | "UI Kits" | "Boilerplates" | "Components" | "Digital Assets" | "Tools";

export type ProductStatus = "Available" | "Coming Soon" | "Beta" | "Discontinued";

export interface Product {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: ProductCategory;
  status: ProductStatus;
  price: number;
  originalPrice?: number;
  currency: "USD" | "EUR" | "BRL";
  technologies: string[];
  compatibility: string[];
  version: string;
  lastUpdated: string;
  thumbnail?: string;
  gallery: string[];
  features: string[];
  includes: string[];
  requirements: string[];
  preview?: {
    images: string[];
    video?: string;
  };
  changelog: ChangelogEntry[];
  faq: FAQEntry[];
  cta: {
    label: string;
    href: string;
  };
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface FAQEntry {
  question: string;
  answer: string;
}

export const products: Product[] = [
  {
    slug: "nexora-dashboard-template",
    name: "NEXORA Dashboard Template",
    description: "Production-ready admin dashboard with authentication, analytics, and component library.",
    longDescription: "A comprehensive dashboard template built for modern SaaS applications. Includes complete authentication flows, role-based access control, interactive charts, data tables with sorting/filtering, and a full component library. Built with Next.js 15, TypeScript, and Tailwind CSS.",
    category: "Templates",
    status: "Available",
    price: 149,
    originalPrice: 199,
    currency: "USD",
    technologies: ["Next.js 15", "TypeScript", "Tailwind CSS", "Supabase", "Chart.js", "React Hook Form", "Zod", "Radix UI"],
    compatibility: ["Vercel", "Netlify", "Docker", "AWS", "Self-hosted"],
    version: "2.1.0",
    lastUpdated: "2024-11-15",
    thumbnail: "/products/dashboard-template-thumb.jpg",
    gallery: [
      "/products/dashboard-template-1.jpg",
      "/products/dashboard-template-2.jpg",
      "/products/dashboard-template-3.jpg",
    ],
    features: [
      "Complete authentication (email/password, OAuth, MFA)",
      "Role-based access control (Admin, Manager, User)",
      "Interactive dashboards with real-time charts",
      "Advanced data tables with export (CSV, PDF)",
      "Dark/Light mode with system preference detection",
      "Internationalization (i18n) ready",
      "Component library with 50+ components",
      "Form validation with React Hook Form + Zod",
      "API routes with tRPC or REST",
      "Database schema with Prisma/Supabase",
      "CI/CD pipeline configuration",
      "Comprehensive documentation",
    ],
    includes: [
      "Full source code (MIT licensed)",
      "Figma design files",
      "Documentation site",
      "6 months of updates",
      "Discord community access",
      "Deployment guides",
    ],
    requirements: [
      "Node.js 20+",
      "npm/pnpm/yarn",
      "Supabase account (for auth/database)",
      "Vercel/Netlify account (for deployment)",
    ],
    preview: {
      images: [
        "/products/dashboard-template-preview-1.jpg",
        "/products/dashboard-template-preview-2.jpg",
      ],
    },
    changelog: [
      {
        version: "2.1.0",
        date: "2024-11-15",
        changes: [
          "Added Supabase Auth v2 support",
          "Updated to Next.js 15 App Router",
          "Improved dark mode performance",
          "Fixed mobile navigation issues",
        ],
      },
      {
        version: "2.0.0",
        date: "2024-09-01",
        changes: [
          "Complete rewrite for Next.js 14+",
          "Added tRPC API layer",
          "New component library",
          "Improved TypeScript coverage",
        ],
      },
    ],
    faq: [
      {
        question: "Can I use this for commercial projects?",
        answer: "Yes, the MIT license allows unlimited commercial use for you and your clients.",
      },
      {
        question: "Do I need a Supabase account?",
        answer: "The template is designed for Supabase but can be adapted to other backends. We provide migration guides.",
      },
      {
        question: "Are updates free?",
        answer: "You receive 6 months of free updates. After that, you can renew at 50% off.",
      },
    ],
    cta: {
      label: "Purchase - $149",
      href: "/checkout?product=nexora-dashboard-template",
    },
  },
  {
    slug: "nexora-ui-kit",
    name: "NEXORA UI Kit",
    description: "60+ accessible, customizable React components with dark mode and animations.",
    longDescription: "A premium component library designed for building beautiful, accessible interfaces. Every component is built with Radix UI primitives, styled with Tailwind CSS, and includes Framer Motion animations. Fully typed with TypeScript and tested with Vitest.",
    category: "UI Kits",
    status: "Available",
    price: 99,
    currency: "USD",
    technologies: ["React 19", "TypeScript", "Tailwind CSS", "Radix UI", "Framer Motion", "Vitest", "Storybook"],
    compatibility: ["Next.js", "Remix", "Vite", "Astro", "React Native Web"],
    version: "3.0.0",
    lastUpdated: "2024-10-20",
    thumbnail: "/products/ui-kit-thumb.jpg",
    gallery: [
      "/products/ui-kit-1.jpg",
      "/products/ui-kit-2.jpg",
    ],
    features: [
      "60+ production-ready components",
      "Full dark mode support",
      "Framer Motion animations",
      "Radix UI accessibility primitives",
      "TypeScript definitions included",
      "Storybook documentation",
      "Vitest test suite",
      "Tree-shakeable ES modules",
      "CSS variables theming",
      "RTL support",
      "Compound component patterns",
      "Unstyled variants for full control",
    ],
    includes: [
      "Component source code",
      "Storybook documentation site",
      "TypeScript definitions",
      "Test files",
      "Figma component library",
      "12 months of updates",
    ],
    requirements: [
      "React 18+",
      "Tailwind CSS 3.4+",
      "TypeScript 5+ (recommended)",
    ],
    preview: {
      images: [
        "/products/ui-kit-preview-1.jpg",
        "/products/ui-kit-preview-2.jpg",
      ],
    },
    changelog: [
      {
        version: "3.0.0",
        date: "2024-10-20",
        changes: [
          "React 19 support",
          "New animation engine",
          "15 new components",
          "Improved tree-shaking",
        ],
      },
    ],
    faq: [
      {
        question: "Is this compatible with shadcn/ui?",
        answer: "Yes, components follow the same patterns and can be mixed with shadcn/ui.",
      },
      {
        question: "Can I customize the design tokens?",
        answer: "Yes, all design tokens use CSS variables for easy theming.",
      },
    ],
    cta: {
      label: "Purchase - $99",
      href: "/checkout?product=nexora-ui-kit",
    },
  },
  {
    slug: "nexora-saas-boilerplate",
    name: "NEXORA SaaS Boilerplate",
    description: "Complete SaaS starter with billing, teams, subscriptions, and admin panel.",
    longDescription: "Launch your SaaS in days, not months. Includes everything you need: authentication, multi-tenant teams, Stripe billing with subscriptions, customer portal, admin dashboard, email templates, and deployment automation. Battle-tested architecture used in production applications.",
    category: "Boilerplates",
    status: "Beta",
    price: 299,
    originalPrice: 399,
    currency: "USD",
    technologies: ["Next.js 15", "TypeScript", "Tailwind CSS", "Supabase", "Stripe", "tRPC", "Prisma", "Resend", "React Email"],
    compatibility: ["Vercel", "AWS", "Railway", "Fly.io", "Docker"],
    version: "1.0.0-beta.3",
    lastUpdated: "2024-12-01",
    thumbnail: "/products/saas-boilerplate-thumb.jpg",
    gallery: [
      "/products/saas-boilerplate-1.jpg",
      "/products/saas-boilerplate-2.jpg",
    ],
    features: [
      "Multi-tenant team/organization support",
      "Stripe subscriptions with customer portal",
      "Usage-based billing ready",
      "Admin dashboard with analytics",
      "Email templates with React Email",
      "Role-based permissions (Owner, Admin, Member)",
      "Invitation flows with magic links",
      "Audit logging and compliance",
      "API key management",
      "Webhook handling with retries",
      "Feature flags system",
      "Automated database migrations",
    ],
    includes: [
      "Full source code",
      "Database schema (Prisma)",
      "Stripe webhook handlers",
      "Email templates",
      "Deployment scripts",
      "Architecture documentation",
      "Lifetime updates (beta pricing)",
    ],
    requirements: [
      "Node.js 20+",
      "PostgreSQL (Supabase/Neon/RDS)",
      "Stripe account",
      "Resend/SendGrid account",
      "Vercel/AWS account",
    ],
    preview: {
      images: [
        "/products/saas-boilerplate-preview-1.jpg",
        "/products/saas-boilerplate-preview-2.jpg",
      ],
    },
    changelog: [
      {
        version: "1.0.0-beta.3",
        date: "2024-12-01",
        changes: [
          "Added feature flags system",
          "Improved Stripe webhook reliability",
          "Fixed team invitation edge cases",
        ],
      },
    ],
    faq: [
      {
        question: "Is this production-ready?",
        answer: "It's in beta but used in production. We recommend thorough testing before launch.",
      },
      {
        question: "Can I remove Stripe and use another provider?",
        answer: "The billing layer is abstracted. We provide adapters for Paddle and Lemon Squeezy.",
      },
    ],
    cta: {
      label: "Join Beta - $299",
      href: "/contact?interest=saas-boilerplate",
    },
  },
  {
    slug: "nexora-component-library",
    name: "NEXORA Component Library",
    description: "Atomic design system with 100+ components, tokens, and documentation.",
    longDescription: "A comprehensive design system built on atomic design principles. Includes foundations (colors, spacing, typography), atoms, molecules, organisms, and templates. Designed for teams building consistent products at scale.",
    category: "Components",
    status: "Coming Soon",
    price: 199,
    currency: "USD",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Style Dictionary", "Figma Tokens", "Storybook", "Changesets"],
    compatibility: ["Next.js", "Remix", "Vite", "Expo", "Electron"],
    version: "0.9.0",
    lastUpdated: "2024-11-01",
    thumbnail: "/products/component-library-thumb.jpg",
    gallery: [
      "/products/component-library-1.jpg",
    ],
    features: [
      "Design tokens (Style Dictionary)",
      "100+ components across 4 layers",
      "Figma sync workflow",
      "Automated visual regression",
      "Accessibility auditing",
      "Bundle size optimization",
      "Multi-brand theming",
      "Documentation site generator",
    ],
    includes: [
      "Source code (monorepo)",
      "Figma library file",
      "Token files (JSON, CSS, SCSS)",
      "Documentation site",
      "Migration tooling",
    ],
    requirements: [
      "Node.js 20+",
      "pnpm (for monorepo)",
      "Figma Professional+ (for sync)",
    ],
    preview: {
      images: [
        "/products/component-library-preview-1.jpg",
      ],
    },
    changelog: [
      {
        version: "0.9.0",
        date: "2024-11-01",
        changes: [
          "Alpha release for early adopters",
          "Core foundations complete",
          "50+ components implemented",
        ],
      },
    ],
    faq: [
      {
        question: "When will it be stable?",
        answer: "Targeting Q1 2025 for v1.0. Early adopters get lifetime discount.",
      },
    ],
    cta: {
      label: "Notify Me",
      href: "/contact?interest=component-library",
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductsByStatus(status: ProductStatus): Product[] {
  return products.filter((p) => p.status === status);
}

export function getAllProducts(): Product[] {
  return products;
}

export const productStatuses: { value: ProductStatus; label: string; color: string }[] = [
  { value: "Available", label: "Available", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { value: "Coming Soon", label: "Coming Soon", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "Beta", label: "Beta", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { value: "Discontinued", label: "Discontinued", color: "bg-muted-foreground/20 text-muted-foreground border-border" },
];

export const productCategories: { value: ProductCategory; label: string }[] = [
  { value: "Templates", label: "Templates" },
  { value: "UI Kits", label: "UI Kits" },
  { value: "Boilerplates", label: "Boilerplates" },
  { value: "Components", label: "Components" },
  { value: "Digital Assets", label: "Digital Assets" },
  { value: "Tools", label: "Tools" },
];

export function getProductStatusColor(status: ProductStatus): string {
  switch (status) {
    case "Available":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Coming Soon":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Beta":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Discontinued":
      return "bg-muted-foreground/20 text-muted-foreground border-border";
    default:
      return "bg-muted-foreground/20 text-muted-foreground border-border";
  }
}