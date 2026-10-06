-- =============================================================================
-- NEXORA GROUP — CLERK INTEGRATION MIGRATION
-- Version: 004
-- Description: Add clerk_user_id to profiles, update RLS for Clerk integration
-- =============================================================================

-- Add clerk_user_id column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clerk_user_id TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON profiles(clerk_user_id);

-- Update profiles table to add deleted_at for soft delete
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON profiles(deleted_at);

-- =============================================================================
-- UPDATE RLS HELPER FUNCTIONS FOR CLERK
-- =============================================================================

-- Check if current user is admin (uses Clerk claims via auth.jwt())
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.jwt() -> 'public_metadata' ->> 'role') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if user owns the profile (Clerk user ID)
CREATE OR REPLACE FUNCTION is_own_profile(profile_clerk_user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.jwt() ->> 'sub') = profile_clerk_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if user is authenticated
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.jwt() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =============================================================================
-- UPDATE PROFILES POLICIES FOR CLERK
-- =============================================================================

-- Drop existing profiles policies
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_signup" ON profiles;

-- Users can read their own profile (by clerk_user_id)
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT USING (is_own_profile(clerk_user_id));

-- Admins can read all profiles
CREATE POLICY "profiles_select_admin" ON profiles
    FOR SELECT USING (is_admin());

-- Users can update their own profile (limited fields, no role escalation)
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE USING (is_own_profile(clerk_user_id))
    WITH CHECK (
        is_own_profile(clerk_user_id)
        AND role = 'user'  -- Prevent role escalation
    );

-- Admins can update any profile
CREATE POLICY "profiles_update_admin" ON profiles
    FOR UPDATE USING (is_admin())
    WITH CHECK (is_admin());

-- Admins can insert/delete profiles
CREATE POLICY "profiles_insert_admin" ON profiles
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "profiles_delete_admin" ON profiles
    FOR DELETE USING (is_admin());

-- =============================================================================
-- UPDATE ALL OTHER TABLES POLICIES TO USE CLERK AUTH
-- =============================================================================

-- Projects policies
DROP POLICY IF EXISTS "projects_select_public" ON projects;
DROP POLICY IF EXISTS "projects_select_auth" ON projects;
DROP POLICY IF EXISTS "projects_all_admin" ON projects;

CREATE POLICY "projects_select_public" ON projects
    FOR SELECT USING (
        published_at IS NOT NULL
        AND status IN ('active', 'coming_soon')
    );

CREATE POLICY "projects_all_admin" ON projects
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Products policies
DROP POLICY IF EXISTS "products_select_public" ON products;
DROP POLICY IF EXISTS "products_select_auth" ON products;
DROP POLICY IF EXISTS "products_all_admin" ON products;

CREATE POLICY "products_select_public" ON products
    FOR SELECT USING (
        published_at IS NOT NULL
        AND status = 'published'
    );

CREATE POLICY "products_all_admin" ON products
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Experiments policies
DROP POLICY IF EXISTS "experiments_select_public" ON experiments;
DROP POLICY IF EXISTS "experiments_select_auth" ON experiments;
DROP POLICY IF EXISTS "experiments_all_admin" ON experiments;

CREATE POLICY "experiments_select_public" ON experiments
    FOR SELECT USING (
        published_at IS NOT NULL
        AND status IN ('validating', 'graduated')
    );

CREATE POLICY "experiments_all_admin" ON experiments
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Categories policies
DROP POLICY IF EXISTS "categories_select_public" ON categories;
DROP POLICY IF EXISTS "categories_insert_admin" ON categories;
DROP POLICY IF EXISTS "categories_update_admin" ON categories;
DROP POLICY IF EXISTS "categories_delete_admin" ON categories;

CREATE POLICY "categories_select_public" ON categories
    FOR SELECT USING (true);

CREATE POLICY "categories_insert_admin" ON categories
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "categories_update_admin" ON categories
    FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "categories_delete_admin" ON categories
    FOR DELETE USING (is_admin());

-- All related tables (timeline, features, technologies, categories, etc.)
-- follow the same pattern: public read for published, admin full access

-- Project timeline events
DROP POLICY IF EXISTS "project_timeline_select_public" ON project_timeline_events;
DROP POLICY IF EXISTS "project_timeline_all_admin" ON project_timeline_events;

CREATE POLICY "project_timeline_select_public" ON project_timeline_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_timeline_events.project_id
            AND projects.published_at IS NOT NULL
            AND projects.status IN ('active', 'coming_soon')
        )
    );

CREATE POLICY "project_timeline_all_admin" ON project_timeline_events
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Project features
DROP POLICY IF EXISTS "project_features_select_public" ON project_features;
DROP POLICY IF EXISTS "project_features_all_admin" ON project_features;

CREATE POLICY "project_features_select_public" ON project_features
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_features.project_id
            AND projects.published_at IS NOT NULL
            AND projects.status IN ('active', 'coming_soon')
        )
    );

CREATE POLICY "project_features_all_admin" ON project_features
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Project technologies
DROP POLICY IF EXISTS "project_technologies_select_public" ON project_technologies;
DROP POLICY IF EXISTS "project_technologies_all_admin" ON project_technologies;

CREATE POLICY "project_technologies_select_public" ON project_technologies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_technologies.project_id
            AND projects.published_at IS NOT NULL
            AND projects.status IN ('active', 'coming_soon')
        )
    );

CREATE POLICY "project_technologies_all_admin" ON project_technologies
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Project categories
DROP POLICY IF EXISTS "project_categories_select_public" ON project_categories;
DROP POLICY IF EXISTS "project_categories_all_admin" ON project_categories;

CREATE POLICY "project_categories_select_public" ON project_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_categories.project_id
            AND projects.published_at IS NOT NULL
            AND projects.status IN ('active', 'coming_soon')
        )
    );

CREATE POLICY "project_categories_all_admin" ON project_categories
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Product versions
DROP POLICY IF EXISTS "product_versions_select_public" ON product_versions;
DROP POLICY IF EXISTS "product_versions_all_admin" ON product_versions;

CREATE POLICY "product_versions_select_public" ON product_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_versions.product_id
            AND products.published_at IS NOT NULL
            AND products.status = 'published'
        )
    );

CREATE POLICY "product_versions_all_admin" ON product_versions
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Product features
DROP POLICY IF EXISTS "product_features_select_public" ON product_features;
DROP POLICY IF EXISTS "product_features_all_admin" ON product_features;

CREATE POLICY "product_features_select_public" ON product_features
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_features.product_id
            AND products.published_at IS NOT NULL
            AND products.status = 'published'
        )
    );

CREATE POLICY "product_features_all_admin" ON product_features
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Product includes
DROP POLICY IF EXISTS "product_includes_select_public" ON product_includes;
DROP POLICY IF EXISTS "product_includes_all_admin" ON product_includes;

CREATE POLICY "product_includes_select_public" ON product_includes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_includes.product_id
            AND products.published_at IS NOT NULL
            AND products.status = 'published'
        )
    );

CREATE POLICY "product_includes_all_admin" ON product_includes
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Product requirements
DROP POLICY IF EXISTS "product_requirements_select_public" ON product_requirements;
DROP POLICY IF EXISTS "product_requirements_all_admin" ON product_requirements;

CREATE POLICY "product_requirements_select_public" ON product_requirements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_requirements.product_id
            AND products.published_at IS NOT NULL
            AND products.status = 'published'
        )
    );

CREATE POLICY "product_requirements_all_admin" ON product_requirements
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Product changelog
DROP POLICY IF EXISTS "product_changelog_select_public" ON product_changelog;
DROP POLICY IF EXISTS "product_changelog_all_admin" ON product_changelog;

CREATE POLICY "product_changelog_select_public" ON product_changelog
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_changelog.product_id
            AND products.published_at IS NOT NULL
            AND products.status = 'published'
        )
    );

CREATE POLICY "product_changelog_all_admin" ON product_changelog
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Product FAQ
DROP POLICY IF EXISTS "product_faq_select_public" ON product_faq;
DROP POLICY IF EXISTS "product_faq_all_admin" ON product_faq;

CREATE POLICY "product_faq_select_public" ON product_faq
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_faq.product_id
            AND products.published_at IS NOT NULL
            AND products.status = 'published'
        )
    );

CREATE POLICY "product_faq_all_admin" ON product_faq
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Product technologies
DROP POLICY IF EXISTS "product_technologies_select_public" ON product_technologies;
DROP POLICY IF EXISTS "product_technologies_all_admin" ON product_technologies;

CREATE POLICY "product_technologies_select_public" ON product_technologies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_technologies.product_id
            AND products.published_at IS NOT NULL
            AND products.status = 'published'
        )
    );

CREATE POLICY "product_technologies_all_admin" ON product_technologies
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Product compatibility
DROP POLICY IF EXISTS "product_compatibility_select_public" ON product_compatibility;
DROP POLICY IF EXISTS "product_compatibility_all_admin" ON product_compatibility;

CREATE POLICY "product_compatibility_select_public" ON product_compatibility
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_compatibility.product_id
            AND products.published_at IS NOT NULL
            AND products.status = 'published'
        )
    );

CREATE POLICY "product_compatibility_all_admin" ON product_compatibility
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Product categories
DROP POLICY IF EXISTS "product_categories_select_public" ON product_categories;
DROP POLICY IF EXISTS "product_categories_all_admin" ON product_categories;

CREATE POLICY "product_categories_select_public" ON product_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_categories.product_id
            AND products.published_at IS NOT NULL
            AND products.status = 'published'
        )
    );

CREATE POLICY "product_categories_all_admin" ON product_categories
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Product assets
DROP POLICY IF EXISTS "product_assets_select_public" ON product_assets;
DROP POLICY IF EXISTS "product_assets_all_admin" ON product_assets;

CREATE POLICY "product_assets_select_public" ON product_assets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_assets.product_id
            AND products.published_at IS NOT NULL
            AND products.status = 'published'
        )
    );

CREATE POLICY "product_assets_all_admin" ON product_assets
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Experiment insights
DROP POLICY IF EXISTS "experiment_insights_select_public" ON experiment_insights;
DROP POLICY IF EXISTS "experiment_insights_all_admin" ON experiment_insights;

CREATE POLICY "experiment_insights_select_public" ON experiment_insights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM experiments
            WHERE experiments.id = experiment_insights.experiment_id
            AND experiments.published_at IS NOT NULL
            AND experiments.status IN ('validating', 'graduated')
        )
    );

CREATE POLICY "experiment_insights_all_admin" ON experiment_insights
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Experiment challenges
DROP POLICY IF EXISTS "experiment_challenges_select_public" ON experiment_challenges;
DROP POLICY IF EXISTS "experiment_challenges_all_admin" ON experiment_challenges;

CREATE POLICY "experiment_challenges_select_public" ON experiment_challenges
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM experiments
            WHERE experiments.id = experiment_challenges.experiment_id
            AND experiments.published_at IS NOT NULL
            AND experiments.status IN ('validating', 'graduated')
        )
    );

CREATE POLICY "experiment_challenges_all_admin" ON experiment_challenges
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Experiment next steps
DROP POLICY IF EXISTS "experiment_next_steps_select_public" ON experiment_next_steps;
DROP POLICY IF EXISTS "experiment_next_steps_all_admin" ON experiment_next_steps;

CREATE POLICY "experiment_next_steps_select_public" ON experiment_next_steps
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM experiments
            WHERE experiments.id = experiment_next_steps.experiment_id
            AND experiments.published_at IS NOT NULL
            AND experiments.status IN ('validating', 'graduated')
        )
    );

CREATE POLICY "experiment_next_steps_all_admin" ON experiment_next_steps
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Experiment technologies
DROP POLICY IF EXISTS "experiment_technologies_select_public" ON experiment_technologies;
DROP POLICY IF EXISTS "experiment_technologies_all_admin" ON experiment_technologies;

CREATE POLICY "experiment_technologies_select_public" ON experiment_technologies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM experiments
            WHERE experiments.id = experiment_technologies.experiment_id
            AND experiments.published_at IS NOT NULL
            AND experiments.status IN ('validating', 'graduated')
        )
    );

CREATE POLICY "experiment_technologies_all_admin" ON experiment_technologies
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Experiment tags
DROP POLICY IF EXISTS "experiment_tags_select_public" ON experiment_tags;
DROP POLICY IF EXISTS "experiment_tags_all_admin" ON experiment_tags;

CREATE POLICY "experiment_tags_select_public" ON experiment_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM experiments
            WHERE experiments.id = experiment_tags.experiment_id
            AND experiments.published_at IS NOT NULL
            AND experiments.status IN ('validating', 'graduated')
        )
    );

CREATE POLICY "experiment_tags_all_admin" ON experiment_tags
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Experiment categories
DROP POLICY IF EXISTS "experiment_categories_select_public" ON experiment_categories;
DROP POLICY IF EXISTS "experiment_categories_all_admin" ON experiment_categories;

CREATE POLICY "experiment_categories_select_public" ON experiment_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM experiments
            WHERE experiments.id = experiment_categories.experiment_id
            AND experiments.published_at IS NOT NULL
            AND experiments.status IN ('validating', 'graduated')
        )
    );

CREATE POLICY "experiment_categories_all_admin" ON experiment_categories
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- =============================================================================
-- TRIGGER FOR UPDATED_AT
-- =============================================================================

-- Ensure updated_at trigger exists on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();