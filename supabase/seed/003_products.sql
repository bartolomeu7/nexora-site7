-- =============================================================================
-- NEXORA GROUP — PRODUCTS SEED DATA
-- Version: 003
-- =============================================================================

-- Insert Products
INSERT INTO products (title, slug, short_description, description, long_description, status, price, original_price, currency, featured, thumbnail_url, hero_image_url, version, last_updated, repository_url, demo_url, published_at) VALUES
('NEXORA Dashboard Template', 'nexora-dashboard-template',
 'Production-ready admin dashboard with authentication, analytics, and component library.',
 'Production-ready admin dashboard with authentication, analytics, and component library.',
 'A comprehensive dashboard template built for modern SaaS applications. Includes complete authentication flows, role-based access control, interactive charts, data tables with sorting/filtering, and a full component library. Built with Next.js 15, TypeScript, and Tailwind CSS.',
 'published', 149.00, 199.00, 'USD', true,
 '/products/dashboard-template-thumb.jpg', '/products/dashboard-template-hero.jpg',
 '2.1.0', '2024-11-15 00:00:00+00',
 'https://github.com/nexora-group/nexora-dashboard-template', NULL, '2024-01-15 00:00:00+00'),

('NEXORA UI Kit', 'nexora-ui-kit',
 '60+ accessible, customizable React components with dark mode and animations.',
 '60+ accessible, customizable React components with dark mode and animations.',
 'A premium component library designed for building beautiful, accessible interfaces. Every component is built with Radix UI primitives, styled with Tailwind CSS, and includes Framer Motion animations. Fully typed with TypeScript and tested with Vitest.',
 'published', 99.00, NULL, 'USD', true,
 '/products/ui-kit-thumb.jpg', '/products/ui-kit-hero.jpg',
 '3.0.0', '2024-10-20 00:00:00+00',
 'https://github.com/nexora-group/nexora-ui-kit', NULL, '2024-01-15 00:00:00+00'),

('NEXORA SaaS Boilerplate', 'nexora-saas-boilerplate',
 'Complete SaaS starter with billing, teams, subscriptions, and admin panel.',
 'Complete SaaS starter with billing, teams, subscriptions, and admin panel.',
 'Launch your SaaS in days, not months. Includes everything you need: authentication, multi-tenant teams, Stripe billing with subscriptions, customer portal, admin dashboard, email templates, and deployment automation. Battle-tested architecture used in production applications.',
 'beta', 299.00, 399.00, 'USD', true,
 '/products/saas-boilerplate-thumb.jpg', '/products/saas-boilerplate-hero.jpg',
 '1.0.0-beta.3', '2024-12-01 00:00:00+00',
 'https://github.com/nexora-group/nexora-saas-boilerplate', NULL, '2024-01-15 00:00:00+00'),

('NEXORA Component Library', 'nexora-component-library',
 'Atomic design system with 100+ components, tokens, and documentation.',
 'Atomic design system with 100+ components, tokens, and documentation.',
 'A comprehensive design system built on atomic design principles. Includes foundations (colors, spacing, typography), atoms, molecules, organisms, and templates. Designed for teams building consistent products at scale.',
 'coming_soon', 199.00, NULL, 'USD', true,
 '/products/component-library-thumb.jpg', '/products/component-library-hero.jpg',
 '0.9.0', '2024-11-01 00:00:00+00',
 'https://github.com/nexora-group/nexora-component-library', NULL, NULL)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    long_description = EXCLUDED.long_description,
    status = EXCLUDED.status,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    currency = EXCLUDED.currency,
    featured = EXCLUDED.featured,
    thumbnail_url = EXCLUDED.thumbnail_url,
    hero_image_url = EXCLUDED.hero_image_url,
    version = EXCLUDED.version,
    last_updated = EXCLUDED.last_updated,
    repository_url = EXCLUDED.repository_url,
    demo_url = EXCLUDED.demo_url,
    published_at = EXCLUDED.published_at,
    updated_at = NOW();

-- Get product IDs for relationships
DO $$
DECLARE
    dashboard_id UUID;
    ui_kit_id UUID;
    saas_id UUID;
    component_lib_id UUID;
    templates_cat_id UUID;
    ui_kits_cat_id UUID;
    boilerplates_cat_id UUID;
    components_cat_id UUID;
BEGIN
    SELECT id INTO dashboard_id FROM products WHERE slug = 'nexora-dashboard-template';
    SELECT id INTO ui_kit_id FROM products WHERE slug = 'nexora-ui-kit';
    SELECT id INTO saas_id FROM products WHERE slug = 'nexora-saas-boilerplate';
    SELECT id INTO component_lib_id FROM products WHERE slug = 'nexora-component-library';
    SELECT id INTO templates_cat_id FROM categories WHERE slug = 'templates';
    SELECT id INTO ui_kits_cat_id FROM categories WHERE slug = 'ui-kits';
    SELECT id INTO boilerplates_cat_id FROM categories WHERE slug = 'boilerplates';
    SELECT id INTO components_cat_id FROM categories WHERE slug = 'components';

    -- Product Versions for Dashboard Template
    INSERT INTO product_versions (product_id, version, changelog, is_current) VALUES
    (dashboard_id, '2.1.0', 'Added Supabase Auth v2 support
Updated to Next.js 15 App Router
Improved dark mode performance
Fixed mobile navigation issues', true),
    (dashboard_id, '2.0.0', 'Complete rewrite for Next.js 14+
Added tRPC API layer
New component library
Improved TypeScript coverage', false)
    ON CONFLICT (product_id, version) DO UPDATE SET
        changelog = EXCLUDED.changelog,
        is_current = EXCLUDED.is_current;

    -- Product Versions for UI Kit
    INSERT INTO product_versions (product_id, version, changelog, is_current) VALUES
    (ui_kit_id, '3.0.0', 'React 19 support
New animation engine
15 new components
Improved tree-shaking', true)
    ON CONFLICT DO NOTHING;

    -- Product Versions for SaaS Boilerplate
    INSERT INTO product_versions (product_id, version, changelog, is_current) VALUES
    (saas_id, '1.0.0-beta.3', 'Added feature flags system
Improved Stripe webhook reliability
Fixed team invitation edge cases', true)
    ON CONFLICT DO NOTHING;

    -- Product Features for Dashboard Template
    INSERT INTO product_features (product_id, feature, display_order) VALUES
    (dashboard_id, 'Complete authentication (email/password, OAuth, MFA)', 1),
    (dashboard_id, 'Role-based access control (Admin, Manager, User)', 2),
    (dashboard_id, 'Interactive dashboards with real-time charts', 3),
    (dashboard_id, 'Advanced data tables with export (CSV, PDF)', 4),
    (dashboard_id, 'Dark/Light mode with system preference detection', 5),
    (dashboard_id, 'Internationalization (i18n) ready', 6),
    (dashboard_id, 'Component library with 50+ components', 6),
    (dashboard_id, 'Form validation with React Hook Form + Zod', 7),
    (dashboard_id, 'API routes with tRPC or REST', 7),
    (dashboard_id, 'Database schema with Prisma/Supabase', 8),
    (dashboard_id, 'CI/CD pipeline configuration', 8),
    (dashboard_id, 'Comprehensive documentation', 9)
    ON CONFLICT DO NOTHING;

    -- Product Features for UI Kit
    INSERT INTO product_features (product_id, feature, display_order) VALUES
    (ui_kit_id, '60+ production-ready components', 1),
    (ui_kit_id, 'Full dark mode support', 2),
    (ui_kit_id, 'Framer Motion animations', 3),
    (ui_kit_id, 'Radix UI accessibility primitives', 4),
    (ui_kit_id, 'TypeScript definitions included', 5),
    (ui_kit_id, 'Storybook documentation', 6),
    (ui_kit_id, 'Vitest test suite', 7),
    (ui_kit_id, 'Tree-shakeable ES modules', 8),
    (ui_kit_id, 'CSS variables theming', 9),
    (ui_kit_id, 'RTL support', 10),
    (ui_kit_id, 'Compound component patterns', 11),
    (ui_kit_id, 'Unstyled variants for full control', 12)
    ON CONFLICT DO NOTHING;

    -- Product Features for SaaS Boilerplate
    INSERT INTO product_features (product_id, feature, display_order) VALUES
    (saas_id, 'Multi-tenant team/organization support', 1),
    (saas_id, 'Stripe subscriptions with customer portal', 2),
    (saas_id, 'Usage-based billing ready', 3),
    (saas_id, 'Admin dashboard with analytics', 4),
    (saas_id, 'Email templates with React Email', 5),
    (saas_id, 'Role-based permissions (Owner, Admin, Member)', 6),
    (saas_id, 'Invitation flows with magic links', 7),
    (saas_id, 'Audit logging and compliance', 8),
    (saas_id, 'API key management', 9),
    (saas_id, 'Webhook handling with retries', 10),
    (saas_id, 'Feature flags system', 11),
    (saas_id, 'Automated database migrations', 12)
    ON CONFLICT DO NOTHING;

    -- Product Includes for Dashboard Template
    INSERT INTO product_includes (product_id, include_item, display_order) VALUES
    (dashboard_id, 'Full source code (MIT licensed)', 1),
    (dashboard_id, 'Figma design files', 2),
    (dashboard_id, 'Documentation site', 3),
    (dashboard_id, '6 months of updates', 4),
    (dashboard_id, 'Discord community access', 5),
    (dashboard_id, 'Deployment guides', 6)
    ON CONFLICT DO NOTHING;

    -- Product Includes for UI Kit
    INSERT INTO product_includes (product_id, include_item, display_order) VALUES
    (ui_kit_id, 'Component source code', 1),
    (ui_kit_id, 'Storybook documentation site', 2),
    (ui_kit_id, 'TypeScript definitions', 3),
    (ui_kit_id, 'Test files', 4),
    (ui_kit_id, 'Figma component library', 5),
    (ui_kit_id, '12 months of updates', 6)
    ON CONFLICT DO NOTHING;

    -- Product Includes for SaaS Boilerplate
    INSERT INTO product_includes (product_id, include_item, display_order) VALUES
    (saas_id, 'Full source code', 1),
    (saas_id, 'Database schema (Prisma)', 2),
    (saas_id, 'Stripe webhook handlers', 3),
    (saas_id, 'Email templates', 4),
    (saas_id, 'Deployment scripts', 5),
    (saas_id, 'Architecture documentation', 6),
    (saas_id, 'Lifetime updates (beta pricing)', 7)
    ON CONFLICT DO NOTHING;

    -- Product Requirements for Dashboard Template
    INSERT INTO product_requirements (product_id, requirement, display_order) VALUES
    (dashboard_id, 'Node.js 20+', 1),
    (dashboard_id, 'npm/pnpm/yarn', 2),
    (dashboard_id, 'Supabase account (for auth/database)', 3),
    (dashboard_id, 'Vercel/Netlify account (for deployment)', 4)
    ON CONFLICT DO NOTHING;

    -- Product Requirements for UI Kit
    INSERT INTO product_requirements (product_id, requirement, display_order) VALUES
    (ui_kit_id, 'React 18+', 1),
    (ui_kit_id, 'Tailwind CSS 3.4+', 2),
    (ui_kit_id, 'TypeScript 5+ (recommended)', 3)
    ON CONFLICT DO NOTHING;

    -- Product Requirements for SaaS Boilerplate
    INSERT INTO product_requirements (product_id, requirement, display_order) VALUES
    (saas_id, 'Node.js 20+', 1),
    (saas_id, 'PostgreSQL (Supabase/Neon/RDS)', 2),
    (saas_id, 'Stripe account', 3),
    (saas_id, 'Resend/SendGrid account', 4),
    (saas_id, 'Vercel/AWS account', 5)
    ON CONFLICT DO NOTHING;

    -- Product Changelog for Dashboard Template
    INSERT INTO product_changelog (product_id, version, date, changes) VALUES
    (dashboard_id, '2.1.0', '2024-11-15', ARRAY['Added Supabase Auth v2 support', 'Updated to Next.js 15 App Router', 'Improved dark mode performance', 'Fixed mobile navigation issues']),
    (dashboard_id, '2.0.0', '2024-09-01', ARRAY['Complete rewrite for Next.js 14+', 'Added tRPC API layer', 'New component library', 'Improved TypeScript coverage'])
    ON CONFLICT DO NOTHING;

    -- Product Changelog for UI Kit
    INSERT INTO product_changelog (product_id, version, date, changes) VALUES
    (ui_kit_id, '3.0.0', '2024-10-20', ARRAY['React 19 support', 'New animation engine', '15 new components', 'Improved tree-shaking'])
    ON CONFLICT DO NOTHING;

    -- Product Changelog for SaaS Boilerplate
    INSERT INTO product_changelog (product_id, version, date, changes) VALUES
    (saas_id, '1.0.0-beta.3', '2024-12-01', ARRAY['Added feature flags system', 'Improved Stripe webhook reliability', 'Fixed team invitation edge cases'])
    ON CONFLICT DO NOTHING;

    -- Product FAQ for Dashboard Template
    INSERT INTO product_faq (product_id, question, answer, display_order) VALUES
    (dashboard_id, 'Can I use this for commercial projects?', 'Yes, the MIT license allows unlimited commercial use for you and your clients.', 1),
    (dashboard_id, 'Do I need a Supabase account?', 'The template is designed for Supabase but can be adapted to other backends. We provide migration guides.', 2),
    (dashboard_id, 'Are updates free?', 'You receive 6 months of free updates. After that, you can renew at 50% off.', 3)
    ON CONFLICT DO NOTHING;

    -- Product FAQ for UI Kit
    INSERT INTO product_faq (product_id, question, answer, display_order) VALUES
    (ui_kit_id, 'Is this compatible with shadcn/ui?', 'Yes, components follow the same patterns and can be mixed with shadcn/ui.', 1),
    (ui_kit_id, 'Can I customize the design tokens?', 'Yes, all design tokens use CSS variables for easy theming.', 2)
    ON CONFLICT DO NOTHING;

    -- Product FAQ for SaaS Boilerplate
    INSERT INTO product_faq (product_id, question, answer, display_order) VALUES
    (saas_id, 'Is this production-ready?', 'It is in beta but used in production. We recommend thorough testing before launch.', 1),
    (saas_id, 'Can I remove Stripe and use another provider?', 'The billing layer is abstracted. We provide adapters for Paddle and Lemon Squeezy.', 2)
    ON CONFLICT DO NOTHING;

    -- Product Technologies
    INSERT INTO product_technologies (product_id, technology) VALUES
    (dashboard_id, 'Next.js 15'), (dashboard_id, 'TypeScript'), (dashboard_id, 'Tailwind CSS'),
    (dashboard_id, 'Supabase'), (dashboard_id, 'Chart.js'), (dashboard_id, 'React Hook Form'),
    (dashboard_id, 'Zod'), (dashboard_id, 'Radix UI')
    ON CONFLICT DO NOTHING;

    INSERT INTO product_technologies (product_id, technology) VALUES
    (ui_kit_id, 'React 19'), (ui_kit_id, 'TypeScript'), (ui_kit_id, 'Tailwind CSS'),
    (ui_kit_id, 'Radix UI'), (ui_kit_id, 'Framer Motion'), (ui_kit_id, 'Vitest'),
    (ui_kit_id, 'Storybook')
    ON CONFLICT DO NOTHING;

    INSERT INTO product_technologies (product_id, technology) VALUES
    (saas_id, 'Next.js 15'), (saas_id, 'TypeScript'), (saas_id, 'Tailwind CSS'),
    (saas_id, 'Supabase'), (saas_id, 'Stripe'), (saas_id, 'tRPC'),
    (saas_id, 'Prisma'), (saas_id, 'Resend'), (saas_id, 'React Email')
    ON CONFLICT DO NOTHING;

    -- Product Compatibility
    INSERT INTO product_compatibility (product_id, platform) VALUES
    (dashboard_id, 'Vercel'), (dashboard_id, 'Netlify'), (dashboard_id, 'Docker'),
    (dashboard_id, 'AWS'), (dashboard_id, 'Self-hosted')
    ON CONFLICT DO NOTHING;

    INSERT INTO product_compatibility (product_id, platform) VALUES
    (ui_kit_id, 'Next.js'), (ui_kit_id, 'Remix'), (ui_kit_id, 'Vite'),
    (ui_kit_id, 'Astro'), (ui_kit_id, 'React Native Web')
    ON CONFLICT DO NOTHING;

    INSERT INTO product_compatibility (product_id, platform) VALUES
    (saas_id, 'Vercel'), (saas_id, 'AWS'), (saas_id, 'Railway'),
    (saas_id, 'Fly.io'), (saas_id, 'Docker')
    ON CONFLICT DO NOTHING;

    -- Product Categories
    INSERT INTO product_categories (product_id, category_id) VALUES
    (dashboard_id, templates_cat_id),
    (ui_kit_id, ui_kits_cat_id),
    (saas_id, boilerplates_cat_id),
    (component_lib_id, components_cat_id)
    ON CONFLICT DO NOTHING;

    -- Product FAQ for UI Kit
    INSERT INTO product_faq (product_id, question, answer, display_order) VALUES
    (ui_kit_id, 'Is this compatible with shadcn/ui?', 'Yes, components follow the same patterns and can be mixed with shadcn/ui.', 1),
    (ui_kit_id, 'Can I customize the design tokens?', 'Yes, all design tokens use CSS variables for easy theming.', 2)
    ON CONFLICT DO NOTHING;

    -- Product FAQ for SaaS Boilerplate
    INSERT INTO product_faq (product_id, question, answer, display_order) VALUES
    (saas_id, 'Is this production-ready?', 'It is in beta but used in production. We recommend thorough testing before launch.', 1),
    (saas_id, 'Can I remove Stripe and use another provider?', 'The billing layer is abstracted. We provide adapters for Paddle and Lemon Squeezy.', 2)
    ON CONFLICT DO NOTHING;

    -- Product FAQ for Component Library
    INSERT INTO product_faq (product_id, question, answer, display_order) VALUES
    (component_lib_id, 'When will it be stable?', 'Targeting Q1 2025 for v1.0. Early adopters get lifetime discount.', 1)
    ON CONFLICT DO NOTHING;
END $$;