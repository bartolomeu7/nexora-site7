-- =============================================================================
-- NEXORA GROUP — PROJECTS SEED DATA
-- Version: 002
-- =============================================================================

-- Insert Projects
INSERT INTO projects (title, slug, short_description, description, long_description, status, featured, thumbnail_url, hero_image_url, repository_url, demo_url, docs_url, started_at, published_at) VALUES
('NEXORA WORKS', 'nexora-works',
 'A unified development platform that streamlines the entire software lifecycle from idea to production.',
 'A unified development platform that streamlines the entire software lifecycle from idea to production.',
 'NEXORA WORKS is our flagship platform designed to eliminate friction in modern software development. It combines project management, CI/CD pipelines, code review automation, and intelligent analytics into a single cohesive experience. Built for teams that value speed without sacrificing quality.',
 'development', true,
 '/projects/nexora-works-thumb.jpg', '/projects/nexora-works-hero.jpg',
 'https://github.com/nexora-group/nexora-works', NULL, 'https://docs.nexora.group/works',
 '2024-01-15 00:00:00+00', NULL),

('MGS', 'mgs',
 'Micro-service governance system for managing distributed architectures at scale.',
 'Micro-service governance system for managing distributed architectures at scale.',
 'MGS (Micro-service Governance System) provides comprehensive tooling for service discovery, configuration management, traffic routing, and policy enforcement across distributed systems. Designed for organizations running complex micro-service architectures who need centralized control without sacrificing team autonomy.',
 'active', true,
 '/projects/mgs-thumb.jpg', '/projects/mgs-hero.jpg',
 'https://github.com/nexora-group/mgs', NULL, 'https://docs.nexora.group/mgs',
 '2023-09-01 00:00:00+00', '2024-01-15 00:00:00+00'),

('STEVE', 'steve',
 'Structured Task Execution & Verification Engine — an AI-native development agent framework.',
 'Structured Task Execution & Verification Engine — an AI-native development agent framework.',
 'STEVE reimagines how developers interact with AI assistants. Rather than chat-based interfaces, STEVE provides structured, verifiable task execution with built-in testing, linting, and validation loops. It transforms natural language intent into typed, executable workflows that can be audited, replayed, and composed.',
 'experimental', true,
 '/projects/steve-thumb.jpg', '/projects/steve-hero.jpg',
 'https://github.com/nexora-group/steve', NULL, NULL,
 '2024-02-01 00:00:00+00', NULL)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    long_description = EXCLUDED.long_description,
    status = EXCLUDED.status,
    featured = EXCLUDED.featured,
    thumbnail_url = EXCLUDED.thumbnail_url,
    hero_image_url = EXCLUDED.hero_image_url,
    repository_url = EXCLUDED.repository_url,
    demo_url = EXCLUDED.demo_url,
    docs_url = EXCLUDED.docs_url,
    started_at = EXCLUDED.started_at,
    published_at = EXCLUDED.published_at,
    updated_at = NOW();

-- Get project IDs for relationships
DO $$
DECLARE
    nexora_works_id UUID;
    mgs_id UUID;
    steve_id UUID;
    platform_cat_id UUID;
    infra_cat_id UUID;
    devtools_cat_id UUID;
BEGIN
    SELECT id INTO nexora_works_id FROM projects WHERE slug = 'nexora-works';
    SELECT id INTO mgs_id FROM projects WHERE slug = 'mgs';
    SELECT id INTO steve_id FROM projects WHERE slug = 'steve';
    SELECT id INTO platform_cat_id FROM categories WHERE slug = 'platform';
    SELECT id INTO infra_cat_id FROM categories WHERE slug = 'infrastructure';
    SELECT id INTO devtools_cat_id FROM categories WHERE slug = 'developer-tools';

    -- Project Timeline Events for NEXORA WORKS
    INSERT INTO project_timeline_events (project_id, date, title, description, type) VALUES
    (nexora_works_id, '2024 Q1', 'Concept & Research', 'Initial research and architecture planning', 'planning'),
    (nexora_works_id, '2024 Q2', 'Core Architecture', 'Platform foundation and data models', 'milestone'),
    (nexora_works_id, '2024 Q3', 'Alpha Release', 'Internal alpha with core features', 'release'),
    (nexora_works_id, '2024 Q4', 'Beta Program', 'Private beta with select teams', 'release'),
    (nexora_works_id, '2025 Q1', 'Public Launch', 'General availability', 'milestone')
    ON CONFLICT DO NOTHING;

    -- Project Timeline Events for MGS
    INSERT INTO project_timeline_events (project_id, date, title, description, type) VALUES
    (mgs_id, '2023 Q3', 'Project Initiated', 'Internal tooling for NEXORA infrastructure', 'planning'),
    (mgs_id, '2023 Q4', 'v0.1 Released', 'Core service registry and config', 'release'),
    (mgs_id, '2024 Q1', 'Traffic Management', 'Canary, blue-green, and mirroring', 'milestone'),
    (mgs_id, '2024 Q2', 'Governance Layer', 'Policy engine and compliance', 'milestone'),
    (mgs_id, '2024 Q3', 'v1.0 GA', 'Production-ready release', 'release')
    ON CONFLICT DO NOTHING;

    -- Project Timeline Events for STEVE
    INSERT INTO project_timeline_events (project_id, date, title, description, type) VALUES
    (steve_id, '2024 Q1', 'Research Phase', 'Exploring structured AI interaction patterns', 'planning'),
    (steve_id, '2024 Q2', 'Core Runtime', 'Execution engine and type system', 'milestone'),
    (steve_id, '2024 Q3', 'Agent Framework', 'Multi-agent coordination primitives', 'milestone'),
    (steve_id, '2024 Q4', 'Developer Preview', 'Early access for selected developers', 'release')
    ON CONFLICT DO NOTHING;

    -- Project Features for NEXORA WORKS
    INSERT INTO project_features (project_id, feature, display_order) VALUES
    (nexora_works_id, 'Unified dashboard for projects, deployments, and metrics', 1),
    (nexora_works_id, 'AI-powered code review assistance', 2),
    (nexora_works_id, 'Automated dependency updates with confidence scoring', 3),
    (nexora_works_id, 'Real-time collaboration on architecture decisions', 4),
    (nexora_works_id, 'Built-in observability and performance tracking', 5),
    (nexora_works_id, 'Custom workflow automation engine', 6)
    ON CONFLICT DO NOTHING;

    -- Project Features for MGS
    INSERT INTO project_features (project_id, feature, display_order) VALUES
    (mgs_id, 'Service registry with health checking', 1),
    (mgs_id, 'Dynamic configuration with versioning', 2),
    (mgs_id, 'Traffic splitting and canary deployments', 3),
    (mgs_id, 'Circuit breaking and retry policies', 4),
    (mgs_id, 'Distributed tracing integration', 5),
    (mgs_id, 'Policy-as-code governance', 6),
    (mgs_id, 'Multi-cluster federation', 7),
    (mgs_id, 'GitOps-native workflows', 8)
    ON CONFLICT DO NOTHING;

    -- Project Features for STEVE
    INSERT INTO project_features (project_id, feature, display_order) VALUES
    (steve_id, 'Typed task definitions with schema validation', 1),
    (steve_id, 'Multi-model orchestration with fallback chains', 2),
    (steve_id, 'Automatic test generation and execution', 3),
    (steve_id, 'Deterministic replay for debugging', 4),
    (steve_id, 'Composable workflow primitives', 5),
    (steve_id, 'Human-in-the-loop checkpoints', 6),
    (steve_id, 'Cost tracking and optimization', 7),
    (steve_id, 'Extensible tool registry', 8)
    ON CONFLICT DO NOTHING;

    -- Project Technologies for NEXORA WORKS
    INSERT INTO project_technologies (project_id, technology) VALUES
    (nexora_works_id, 'Next.js'),
    (nexora_works_id, 'TypeScript'),
    (nexora_works_id, 'PostgreSQL'),
    (nexora_works_id, 'Redis'),
    (nexora_works_id, 'Docker'),
    (nexora_works_id, 'Kubernetes'),
    (nexora_works_id, 'GraphQL'),
    (nexora_works_id, 'Tailwind CSS')
    ON CONFLICT DO NOTHING;

    -- Project Technologies for MGS
    INSERT INTO project_technologies (project_id, technology) VALUES
    (mgs_id, 'Go'),
    (mgs_id, 'gRPC'),
    (mgs_id, 'NATS'),
    (mgs_id, 'etcd'),
    (mgs_id, 'Prometheus'),
    (mgs_id, 'OpenTelemetry'),
    (mgs_id, 'Envoy'),
    (mgs_id, 'Helm')
    ON CONFLICT DO NOTHING;

    -- Project Technologies for STEVE
    INSERT INTO project_technologies (project_id, technology) VALUES
    (steve_id, 'TypeScript'),
    (steve_id, 'Python'),
    (steve_id, 'Rust'),
    (steve_id, 'WebAssembly'),
    (steve_id, 'LLM APIs'),
    (steve_id, 'JSON Schema'),
    (steve_id, 'Zod'),
    (steve_id, 'Effect TS')
    ON CONFLICT DO NOTHING;

    -- Project Categories
    INSERT INTO project_categories (project_id, category_id) VALUES
    (nexora_works_id, platform_cat_id),
    (mgs_id, infra_cat_id),
    (steve_id, devtools_cat_id)
    ON CONFLICT DO NOTHING;
END $$;