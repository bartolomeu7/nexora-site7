-- =============================================================================
-- NEXORA GROUP — CATEGORIES SEED DATA
-- Version: 001
-- =============================================================================

-- Project Categories
INSERT INTO categories (name, slug, description, type) VALUES
('Platform', 'platform', 'Unified development platforms and tools', 'project'),
('Infrastructure', 'infrastructure', 'Distributed systems and infrastructure tools', 'project'),
('Developer Tools', 'developer-tools', 'Tools for developer productivity and workflow', 'project'),
('Applications', 'applications', 'End-user applications and services', 'project'),
('Templates', 'templates', 'Ready-to-use project templates and starters', 'product'),
('UI Kits', 'ui-kits', 'Component libraries and design systems', 'product'),
('Boilerplates', 'boilerplates', 'Complete starter kits for applications', 'product'),
('Components', 'components', 'Individual components and libraries', 'product'),
('Digital Assets', 'digital-assets', 'Design assets, icons, fonts, and resources', 'product'),
('Tools', 'tools', 'Developer tools and utilities', 'product'),
('AI/ML', 'ai-ml', 'Artificial Intelligence and Machine Learning experiments', 'experiment'),
('Graphics', 'graphics', 'Graphics, rendering, and visualization experiments', 'experiment'),
('Systems', 'systems', 'Distributed systems and infrastructure experiments', 'experiment'),
('Web', 'web', 'Web platform and browser experiments', 'experiment'),
('Research', 'research', 'Research and exploratory experiments', 'experiment'),
('Tools', 'tools', 'Developer tools and utilities experiments', 'experiment')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    type = EXCLUDED.type,
    updated_at = NOW();