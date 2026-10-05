-- =============================================================================
-- NEXORA GROUP — INITIAL DATABASE SCHEMA
-- Version: 001
-- Description: Core tables for projects, products, experiments, and user profiles
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- CATEGORIES
-- =============================================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('project', 'product', 'experiment')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_slug ON categories(slug);

-- =============================================================================
-- PROFILES (extends auth.users)
-- =============================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- =============================================================================
-- PROJECTS
-- =============================================================================
CREATE TYPE project_status AS ENUM (
    'development',
    'active',
    'experimental',
    'coming_soon',
    'archived'
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    long_description TEXT,
    status project_status NOT NULL DEFAULT 'development',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    thumbnail_url TEXT,
    hero_image_url TEXT,
    repository_url TEXT,
    demo_url TEXT,
    docs_url TEXT,
    started_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_published_at ON projects(published_at);

-- =============================================================================
-- PROJECT TIMELINE EVENTS
-- =============================================================================
CREATE TYPE timeline_event_type AS ENUM (
    'planning',
    'milestone',
    'release',
    'update'
);

CREATE TABLE project_timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type timeline_event_type NOT NULL DEFAULT 'milestone',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_timeline_project_id ON project_timeline_events(project_id);

-- =============================================================================
-- PROJECT FEATURES
-- =============================================================================
CREATE TABLE project_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_project_features_project_id ON project_features(project_id);

-- =============================================================================
-- PROJECT TECHNOLOGIES
-- =============================================================================
CREATE TABLE project_technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    technology TEXT NOT NULL
);

CREATE INDEX idx_project_technologies_project_id ON project_technologies(project_id);

-- =============================================================================
-- PROJECT CATEGORIES (many-to-many)
-- =============================================================================
CREATE TABLE project_categories (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- =============================================================================
-- PRODUCTS
-- =============================================================================
CREATE TYPE product_status AS ENUM (
    'draft',
    'published',
    'coming_soon',
    'archived'
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    long_description TEXT,
    status product_status NOT NULL DEFAULT 'draft',
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    original_price NUMERIC(10, 2),
    currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'BRL')),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    thumbnail_url TEXT,
    hero_image_url TEXT,
    version TEXT,
    last_updated TIMESTAMPTZ,
    repository_url TEXT,
    demo_url TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_published_at ON products(published_at);

-- =============================================================================
-- PRODUCT VERSIONS
-- =============================================================================
CREATE TABLE product_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    changelog TEXT,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (product_id, version)
);

CREATE INDEX idx_product_versions_product_id ON product_versions(product_id);
CREATE INDEX idx_product_versions_is_current ON product_versions(is_current);

-- =============================================================================
-- PRODUCT FEATURES
-- =============================================================================
CREATE TABLE product_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_product_features_product_id ON product_features(product_id);

-- =============================================================================
-- PRODUCT INCLUDES
-- =============================================================================
CREATE TABLE product_includes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    include_item TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_product_includes_product_id ON product_includes(product_id);

-- =============================================================================
-- PRODUCT REQUIREMENTS
-- =============================================================================
CREATE TABLE product_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    requirement TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_product_requirements_product_id ON product_requirements(product_id);

-- =============================================================================
-- PRODUCT CHANGELOG
-- =============================================================================
CREATE TABLE product_changelog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    date DATE NOT NULL,
    changes TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (product_id, version)
);

CREATE INDEX idx_product_changelog_product_id ON product_changelog(product_id);

-- =============================================================================
-- PRODUCT FAQ
-- =============================================================================
CREATE TABLE product_faq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_product_faq_product_id ON product_faq(product_id);

-- =============================================================================
-- PRODUCT TECHNOLOGIES
-- =============================================================================
CREATE TABLE product_technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    technology TEXT NOT NULL
);

CREATE INDEX idx_product_technologies_product_id ON product_technologies(product_id);

-- =============================================================================
-- PRODUCT COMPATIBILITY
-- =============================================================================
CREATE TABLE product_compatibility (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    platform TEXT NOT NULL
);

CREATE INDEX idx_product_compatibility_product_id ON product_compatibility(product_id);

-- =============================================================================
-- PRODUCT CATEGORIES (many-to-many)
-- =============================================================================
CREATE TABLE product_categories (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- =============================================================================
-- PRODUCT ASSETS (for Supabase Storage)
-- =============================================================================
CREATE TABLE product_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    version_id UUID REFERENCES product_versions(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'archive', 'document', 'other')),
    storage_path TEXT NOT NULL,
    size_bytes BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_assets_product_id ON product_assets(product_id);
CREATE INDEX idx_product_assets_version_id ON product_assets(version_id);

-- =============================================================================
-- EXPERIMENTS
-- =============================================================================
CREATE TYPE experiment_status AS ENUM (
    'exploring',
    'prototyping',
    'validating',
    'archived',
    'graduated'
);

CREATE TABLE experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    long_description TEXT,
    status experiment_status NOT NULL DEFAULT 'exploring',
    thumbnail_url TEXT,
    demo_url TEXT,
    article_url TEXT,
    paper_url TEXT,
    github_url TEXT,
    started_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_experiments_status ON experiments(status);
CREATE INDEX idx_experiments_slug ON experiments(slug);
CREATE INDEX idx_experiments_published_at ON experiments(published_at);

-- =============================================================================
-- EXPERIMENT INSIGHTS
-- =============================================================================
CREATE TABLE experiment_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    insight TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_experiment_insights_experiment_id ON experiment_insights(experiment_id);

-- =============================================================================
-- EXPERIMENT CHALLENGES
-- =============================================================================
CREATE TABLE experiment_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    challenge TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_experiment_challenges_experiment_id ON experiment_challenges(experiment_id);

-- =============================================================================
-- EXPERIMENT NEXT STEPS
-- =============================================================================
CREATE TABLE experiment_next_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    step TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_experiment_next_steps_experiment_id ON experiment_next_steps(experiment_id);

-- =============================================================================
-- EXPERIMENT TECHNOLOGIES
-- =============================================================================
CREATE TABLE experiment_technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    technology TEXT NOT NULL
);

CREATE INDEX idx_experiment_technologies_experiment_id ON experiment_technologies(experiment_id);

-- =============================================================================
-- EXPERIMENT TAGS
-- =============================================================================
CREATE TABLE experiment_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    tag TEXT NOT NULL
);

CREATE INDEX idx_experiment_tags_experiment_id ON experiment_tags(experiment_id);

-- =============================================================================
-- EXPERIMENT CATEGORIES (many-to-many)
-- =============================================================================
CREATE TABLE experiment_categories (
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (experiment_id, category_id)
);

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiments_updated_at BEFORE UPDATE ON experiments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();