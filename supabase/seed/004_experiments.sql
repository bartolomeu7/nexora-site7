-- =============================================================================
-- NEXORA GROUP — EXPERIMENTS SEED DATA
-- Version: 004
-- =============================================================================

-- Insert Experiments
INSERT INTO experiments (title, slug, description, long_description, status, thumbnail_url, demo_url, article_url, paper_url, github_url, started_at, published_at) VALUES
('Neural Rendering Pipeline', 'neural-rendering',
 'Exploring real-time neural rendering techniques for web-based 3D experiences.',
 'Investigating the intersection of neural radiance fields (NeRFs), Gaussian splatting, and web-based rendering. The goal is to enable photorealistic 3D scenes in browsers without requiring massive downloads or specialized hardware. We''re experimenting with compressed representations, progressive streaming, and hybrid traditional/neural pipelines.',
 'prototyping', '/experiments/neural-rendering-thumb.jpg', NULL, 'https://blog.nexora.group/neural-rendering-web', NULL, 'https://github.com/nexora-group/neural-rendering-web',
 '2024-03-01 00:00:00+00', '2024-06-01 00:00:00+00'),

('Local-First Sync Protocol', 'local-first-sync',
 'Building a conflict-free replicated data type (CRDT) based sync engine for offline-first applications.',
 'Traditional cloud-first architectures create dependency on connectivity and centralized servers. This experiment explores a peer-to-peer synchronization protocol using CRDTs that enables true local-first applications with eventual consistency, conflict resolution, and offline capability. Target use cases: collaborative editors, mobile apps, edge computing.',
 'validating', '/experiments/local-first-thumb.jpg', 'https://local-first-demo.nexora.group', NULL, NULL, 'https://github.com/nexora-group/local-first-sync',
 '2024-01-15 00:00:00+00', '2024-06-01 00:00:00+00'),

('Code Intelligence Graph', 'code-intelligence-graph',
 'A semantic code graph that understands codebase structure, dependencies, and evolution patterns.',
 'Moving beyond syntactic analysis (AST/LSP) to semantic understanding of codebases. This experiment builds a knowledge graph representing code entities (functions, types, modules), their relationships (calls, imports, types), and temporal evolution (git history). Applications: intelligent refactoring, architectural drift detection, onboarding acceleration, impact analysis.',
 'exploring', '/experiments/code-graph-thumb.jpg', NULL, NULL, NULL, 'https://github.com/nexora-group/code-intelligence-graph',
 '2024-06-01 00:00:00+00', NULL),

('RSC Patterns Library', 'react-server-components-patterns',
 'Cataloging and validating React Server Component patterns for real-world applications.',
 'React Server Components introduce new mental models for data fetching, composition, and interactivity boundaries. This experiment systematically explores patterns for: server/client composition, streaming strategies, cache invalidation, form handling, and progressive enhancement. Goal: establish a pattern library with trade-offs documented for each.',
 'prototyping', '/experiments/rsc-patterns-thumb.jpg', NULL, 'https://blog.nexora.group/rsc-patterns', NULL, 'https://github.com/nexora-group/rsc-patterns',
 '2024-04-15 00:00:00+00', '2024-06-01 00:00:00+00'),

('WebGPU Compute for Data Processing', 'webgpu-compute',
 'Leveraging GPU compute shaders in the browser for large-scale data transformation and visualization.',
 'WebGPU brings compute shaders to the web, enabling parallel data processing on GPU. This experiment explores using compute shaders for: large dataset aggregation, real-time filtering/sorting, statistical computations, and physics simulations. Target: data-intensive dashboards, scientific visualization, and interactive analytics.',
 'prototyping', '/experiments/webgpu-compute-thumb.jpg', 'https://webgpu-compute.nexora.group', NULL, NULL, 'https://github.com/nexora-group/webgpu-compute',
 '2024-05-01 00:00:00+00', '2024-06-01 00:00:00+00'),

('Declarative Infrastructure DSL', 'declarative-infrastructure',
 'A domain-specific language for expressing infrastructure as typed, composable, and verifiable code.',
 'Current IaC tools (Terraform, Pulumi, CDK) have limitations: weak typing, limited composition, poor testing, and drift detection gaps. This experiment designs a DSL with: strong dependent types, algebraic effects for side effects, formal verification hooks, and built-in simulation. Goal: infrastructure code that''s as maintainable as application code.',
 'exploring', '/experiments/declarative-infra-thumb.jpg', NULL, NULL, NULL, 'https://github.com/nexora-group/declarative-infra-dsl',
 '2024-07-01 00:00:00+00', NULL)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    long_description = EXCLUDED.long_description,
    status = EXCLUDED.status,
    thumbnail_url = EXCLUDED.thumbnail_url,
    demo_url = EXCLUDED.demo_url,
    article_url = EXCLUDED.article_url,
    paper_url = EXCLUDED.paper_url,
    github_url = EXCLUDED.github_url,
    started_at = EXCLUDED.started_at,
    published_at = EXCLUDED.published_at,
    updated_at = NOW();

-- Get experiment IDs for relationships
DO $$
DECLARE
    neural_id UUID;
    local_first_id UUID;
    code_graph_id UUID;
    rsc_id UUID;
    webgpu_id UUID;
    declarative_id UUID;
    graphics_cat_id UUID;
    systems_cat_id UUID;
    ai_ml_cat_id UUID;
    web_cat_id UUID;
    tools_cat_id UUID;
BEGIN
    SELECT id INTO neural_id FROM experiments WHERE slug = 'neural-rendering';
    SELECT id INTO local_first_id FROM experiments WHERE slug = 'local-first-sync';
    SELECT id INTO code_graph_id FROM experiments WHERE slug = 'code-intelligence-graph';
    SELECT id INTO rsc_id FROM experiments WHERE slug = 'react-server-components-patterns';
    SELECT id INTO webgpu_id FROM experiments WHERE slug = 'webgpu-compute';
    SELECT id INTO declarative_id FROM experiments WHERE slug = 'declarative-infrastructure';
    SELECT id INTO graphics_cat_id FROM categories WHERE slug = 'graphics';
    SELECT id INTO systems_cat_id FROM categories WHERE slug = 'systems';
    SELECT id INTO ai_ml_cat_id FROM categories WHERE slug = 'ai-ml';
    SELECT id INTO web_cat_id FROM categories WHERE slug = 'web';
    SELECT id INTO tools_cat_id FROM categories WHERE slug = 'tools';

    -- Experiment Insights
    INSERT INTO experiment_insights (experiment_id, insight, display_order) VALUES
    (neural_id, 'WebGPU compute shaders can accelerate neural inference 10-50x vs WebGL', 1),
    (neural_id, 'Gaussian splatting is more web-friendly than NeRFs due to rasterization approach', 2),
    (neural_id, 'Model compression (quantization, distillation) is critical for web delivery', 3),
    (neural_id, 'Progressive loading requires careful level-of-detail design', 4)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_insights (experiment_id, insight, display_order) VALUES
    (local_first_id, 'Yjs provides excellent text CRDT but struggles with complex nested objects', 1),
    (local_first_id, 'Automerge has better JSON-like semantics but higher memory overhead', 2),
    (local_first_id, 'WebRTC mesh networks don''t scale beyond ~10 peers without relay', 3),
    (local_first_id, 'IndexedDB performance varies significantly across browsers', 4)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_insights (experiment_id, insight, display_order) VALUES
    (code_graph_id, 'Static analysis + embeddings captures more semantics than either alone', 1),
    (code_graph_id, 'Git history provides crucial context for ''why'' not just ''what''', 2),
    (code_graph_id, 'Graph databases (Neo4j) outperform relational for traversal queries', 2),
    (code_graph_id, 'Incremental updates are essential for large codebases', 3)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_insights (experiment_id, insight, display_order) VALUES
    (rsc_id, 'Server components by default, client components by exception works well', 1),
    (rsc_id, 'Streaming SSR with Suspense boundaries improves perceived performance', 2),
    (rsc_id, 'Cache tagging/invalidation is the hardest part to get right', 3),
    (rsc_id, 'Forms remain challenging — progressive enhancement pattern helps', 4)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_insights (experiment_id, insight, display_order) VALUES
    (webgpu_id, 'Compute shaders can process 10M+ rows at 60fps on modern GPUs', 1),
    (webgpu_id, 'Data transfer (CPU↔GPU) is the primary bottleneck', 2),
    (webgpu_id, 'WGSL is approachable for TypeScript developers', 3),
    (webgpu_id, 'Web Workers essential for keeping main thread responsive', 4)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_insights (experiment_id, insight, display_order) VALUES
    (declarative_id, 'Existing config languages (CUE, Dhall, KCL) solve different subsets', 1),
    (declarative_id, 'Dependent types can encode infrastructure invariants (e.g., ''this port is unique'')', 2),
    (declarative_id, 'Simulation/execution duality enables safe preview', 3),
    (declarative_id, 'Effect systems model side effects (create, delete, update) precisely', 4)
    ON CONFLICT DO NOTHING;

    -- Experiment Challenges
    INSERT INTO experiment_challenges (experiment_id, challenge, display_order) VALUES
    (neural_id, 'Model sizes (100MB+) exceed practical web budgets', 1),
    (neural_id, 'WebGPU adoption still limited (~70% globally)', 2),
    (neural_id, 'Thermal throttling on mobile devices', 3),
    (neural_id, 'Cross-browser WebGPU implementation differences', 4)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_challenges (experiment_id, challenge, display_order) VALUES
    (local_first_id, 'Garbage collection of CRDT metadata over time', 1),
    (local_first_id, 'Schema evolution with CRDTs is non-trivial', 2),
    (local_first_id, 'Network partition handling in peer-to-peer', 2),
    (local_first_id, 'Mobile background sync limitations', 3)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_challenges (experiment_id, challenge, display_order) VALUES
    (code_graph_id, 'Cross-language analysis requires unified intermediate representation', 1),
    (code_graph_id, 'Embedding costs at scale (millions of nodes)', 2),
    (code_graph_id, 'Privacy concerns with cloud LLM APIs', 2),
    (code_graph_id, 'Keeping graph in sync with rapid code changes', 3)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_challenges (experiment_id, challenge, display_order) VALUES
    (rsc_id, 'Mental model shift for teams used to client-side rendering', 1),
    (rsc_id, 'Bundle size analysis across server/client boundary', 2),
    (rsc_id, 'Testing strategies for server components', 2),
    (rsc_id, 'Migration from existing client-heavy apps', 3)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_challenges (experiment_id, challenge, display_order) VALUES
    (webgpu_id, 'WebGPU not available in Safari (behind flag)', 1),
    (webgpu_id, 'Memory limits on integrated graphics', 2),
    (webgpu_id, 'Debugging compute shaders is difficult', 2),
    (webgpu_id, 'Fallback strategies for non-WebGPU browsers', 3)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_challenges (experiment_id, challenge, display_order) VALUES
    (declarative_id, 'Learning curve for infrastructure engineers', 1),
    (declarative_id, 'Ecosystem integration (providers, modules)', 2),
    (declarative_id, 'Migration from existing IaC', 2),
    (declarative_id, 'Runtime vs compile-time verification trade-offs', 3)
    ON CONFLICT DO NOTHING;

    -- Experiment Next Steps
    INSERT INTO experiment_next_steps (experiment_id, step, display_order) VALUES
    (neural_id, 'Implement progressive Gaussian splatting loader', 1),
    (neural_id, 'Benchmark quantized models on mobile GPUs', 2),
    (neural_id, 'Explore WebNN for inference acceleration', 2),
    (neural_id, 'Publish technical write-up', 3)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_next_steps (experiment_id, step, display_order) VALUES
    (local_first_id, 'Build schema migration tooling for Automerge', 1),
    (local_first_id, 'Implement relay server for NAT traversal', 2),
    (local_first_id, 'Create React hooks library for local-first state', 2),
    (local_first_id, 'Benchmark against Firebase/Supabase Realtime', 3)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_next_steps (experiment_id, step, display_order) VALUES
    (code_graph_id, 'Build Tree-sitter multi-language parser pipeline', 1),
    (code_graph_id, 'Experiment with local embedding models (BGE, E5)', 2),
    (code_graph_id, 'Design incremental graph update algorithm', 2),
    (code_graph_id, 'Prototype VS Code extension for visualization', 3)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_next_steps (experiment_id, step, display_order) VALUES
    (rsc_id, 'Document 20+ validated patterns with code examples', 1),
    (rsc_id, 'Build interactive pattern explorer', 2),
    (rsc_id, 'Create codemods for common migrations', 2),
    (rsc_id, 'Publish as open-source reference', 3)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_next_steps (experiment_id, step, display_order) VALUES
    (webgpu_id, 'Build reusable compute shader library', 1),
    (webgpu_id, 'Create WebGPU + WASM hybrid fallback', 2),
    (webgpu_id, 'Benchmark against DuckDB-WASM', 2),
    (webgpu_id, 'Publish performance guide', 3)
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_next_steps (experiment_id, step, display_order) VALUES
    (declarative_id, 'Prototype core type system in TypeScript', 1),
    (declarative_id, 'Implement Kubernetes resource model', 2),
    (declarative_id, 'Build VS Code language server', 2),
    (declarative_id, 'Design provider plugin architecture', 3)
    ON CONFLICT DO NOTHING;

    -- Experiment Technologies
    INSERT INTO experiment_technologies (experiment_id, technology) VALUES
    (neural_id, 'WebGPU'), (neural_id, 'WebAssembly'), (neural_id, 'Python'),
    (neural_id, 'PyTorch'), (neural_id, 'CUDA'), (neural_id, 'GLSL'),
    (neural_id, 'Three.js'), (neural_id, 'ONNX Runtime Web')
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_technologies (experiment_id, technology) VALUES
    (local_first_id, 'Rust'), (local_first_id, 'TypeScript'), (local_first_id, 'WebRTC'),
    (local_first_id, 'IndexedDB'), (local_first_id, 'Yjs'), (local_first_id, 'Automerge'),
    (local_first_id, 'libp2p'), (local_first_id, 'WASM')
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_technologies (experiment_id, technology) VALUES
    (code_graph_id, 'TypeScript'), (code_graph_id, 'Python'), (code_graph_id, 'Tree-sitter'),
    (code_graph_id, 'Neo4j'), (code_graph_id, 'GraphQL'), (code_graph_id, 'Embeddings'),
    (code_graph_id, 'LLM'), (code_graph_id, 'Git')
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_technologies (experiment_id, technology) VALUES
    (rsc_id, 'Next.js 15'), (rsc_id, 'React 19'), (rsc_id, 'TypeScript'),
    (rsc_id, 'Tailwind CSS'), (rsc_id, 'tRPC'), (rsc_id, 'PostgreSQL'), (rsc_id, 'Redis')
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_technologies (experiment_id, technology) VALUES
    (webgpu_id, 'WebGPU'), (webgpu_id, 'WGSL'), (webgpu_id, 'TypeScript'),
    (webgpu_id, 'Web Workers'), (webgpu_id, 'Arrow/Parquet'), (webgpu_id, 'Apache Arrow JS'),
    (webgpu_id, 'Canvas 2D/WebGL')
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_technologies (experiment_id, technology) VALUES
    (declarative_id, 'TypeScript'), (declarative_id, 'Rust'), (declarative_id, 'KCL'),
    (declarative_id, 'CUE'), (declarative_id, 'Dhall'), (declarative_id, 'WebAssembly'),
    (declarative_id, 'Kubernetes'), (declarative_id, 'Crossplane')
    ON CONFLICT DO NOTHING;

    -- Experiment Tags
    INSERT INTO experiment_tags (experiment_id, tag) VALUES
    (neural_id, '3D'), (neural_id, 'WebGPU'), (neural_id, 'ML'),
    (neural_id, 'Graphics'), (neural_id, 'Real-time')
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_tags (experiment_id, tag) VALUES
    (local_first_id, 'CRDT'), (local_first_id, 'Offline-first'),
    (local_first_id, 'P2P'), (local_first_id, 'Sync'), (local_first_id, 'Distributed Systems')
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_tags (experiment_id, tag) VALUES
    (code_graph_id, 'AST'), (code_graph_id, 'Knowledge Graph'),
    (code_graph_id, 'LLM'), (code_graph_id, 'Developer Tools'), (code_graph_id, 'Static Analysis')
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_tags (experiment_id, tag) VALUES
    (rsc_id, 'React'), (rsc_id, 'RSC'), (rsc_id, 'Next.js'),
    (rsc_id, 'Architecture'), (rsc_id, 'Patterns')
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_tags (experiment_id, tag) VALUES
    (webgpu_id, 'WebGPU'), (webgpu_id, 'Compute Shaders'),
    (webgpu_id, 'Data Viz'), (webgpu_id, 'Performance'), (webgpu_id, 'WGSL')
    ON CONFLICT DO NOTHING;

    INSERT INTO experiment_tags (experiment_id, tag) VALUES
    (declarative_id, 'IaC'), (declarative_id, 'DSL'),
    (declarative_id, 'Types'), (declarative_id, 'Kubernetes'), (declarative_id, 'Verification')
    ON CONFLICT DO NOTHING;

    -- Experiment Categories
    INSERT INTO experiment_categories (experiment_id, category_id) VALUES
    (SELECT id FROM experiments WHERE slug = 'neural-rendering', (SELECT id FROM categories WHERE slug = 'graphics')),
    (SELECT id FROM experiments WHERE slug = 'local-first-sync', (SELECT id FROM categories WHERE slug = 'systems')),
    (SELECT id FROM experiments WHERE slug = 'code-intelligence-graph', (SELECT id FROM categories WHERE slug = 'ai-ml')),
    (SELECT id FROM experiments WHERE slug = 'react-server-components-patterns', (SELECT id FROM categories WHERE slug = 'web')),
    (SELECT id FROM experiments WHERE slug = 'webgpu-compute', (SELECT id FROM categories WHERE slug = 'web')),
    (SELECT id FROM experiments WHERE slug = 'declarative-infrastructure', (SELECT id FROM categories WHERE slug = 'tools'))
    ON CONFLICT DO NOTHING;
END $$;