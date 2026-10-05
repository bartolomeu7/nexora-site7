-- =============================================================================
-- NEXORA GROUP — RLS POLICIES
-- Version: 002
-- Description: Row Level Security policies for all tables
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_includes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_changelog ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_next_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_includes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_changelog ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_next_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_categories ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- HELPER FUNCTIONS FOR RLS
-- =============================================================================

-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if user owns the profile
CREATE OR REPLACE FUNCTION is_own_profile(profile_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() = profile_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if user is authenticated
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =============================================================================
-- CATEGORIES POLICIES
-- =============================================================================

-- Public can read all categories
CREATE POLICY "categories_select_public" ON categories
    FOR SELECT USING (true);

-- Only admins can insert/update/delete categories
CREATE POLICY "categories_insert_admin" ON categories
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "categories_update_admin" ON categories
    FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "categories_delete_admin" ON categories
    FOR DELETE USING (is_admin());

-- =============================================================================
-- PROFILES POLICIES
-- =============================================================================

-- Users can read their own profile
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT USING (is_own_profile(user_id));

-- Admins can read all profiles
CREATE POLICY "profiles_select_admin" ON profiles
    FOR SELECT USING (is_admin());

-- Users can update their own profile (limited fields)
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE USING (is_own_profile(user_id))
    WITH CHECK (
        is_own_profile(user_id)
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
-- PROJECTS POLICIES
-- =============================================================================

-- Anonymous: can read published, active projects
CREATE POLICY "projects_select_public" ON projects
    FOR SELECT USING (
        published_at IS NOT NULL
        AND status IN ('active', 'coming_soon')
    );

-- Authenticated users: can read published projects
CREATE POLICY "projects_select_auth" ON projects
    FOR SELECT USING (
        published_at IS NOT NULL
        AND status IN ('active', 'coming_soon')
    );

-- Admins: full access
CREATE POLICY "projects_all_admin" ON projects
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- =============================================================================
-- PROJECT TIMELINE EVENTS POLICIES
-- =============================================================================

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

-- =============================================================================
-- PROJECT FEATURES POLICIES
-- =============================================================================

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

-- =============================================================================
-- PROJECT TECHNOLOGIES POLICIES
-- =============================================================================

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

-- =============================================================================
-- PROJECT CATEGORIES POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCTS POLICIES
-- =============================================================================

-- Anonymous: can read published products
CREATE POLICY "products_select_public" ON products
    FOR SELECT USING (
        published_at IS NOT NULL
        AND status = 'published'
    );

-- Authenticated users: can read published products
CREATE POLICY "products_select_auth" ON products
    FOR SELECT USING (
        published_at IS NOT NULL
        AND status = 'published'
    );

-- Admins: full access
CREATE POLICY "products_all_admin" ON products
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- =============================================================================
-- PRODUCT VERSIONS POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT FEATURES POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT INCLUDES POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT REQUIREMENTS POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT CHANGELOG POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT FAQ POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT TECHNOLOGIES POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT COMPATIBILITY POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT CATEGORIES POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT ASSETS POLICIES
-- =============================================================================

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

-- =============================================================================
-- EXPERIMENTS POLICIES
-- =============================================================================

-- Anonymous: can read published experiments
CREATE POLICY "experiments_select_public" ON experiments
    FOR SELECT USING (
        published_at IS NOT NULL
        AND status IN ('validating', 'graduated')
    );

-- Authenticated users: can read published experiments
CREATE POLICY "experiments_select_auth" ON experiments
    FOR SELECT USING (
        published_at IS NOT NULL
        AND status IN ('validating', 'graduated')
    );

-- Admins: full access
CREATE POLICY "experiments_all_admin" ON experiments
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- =============================================================================
-- EXPERIMENT INSIGHTS POLICIES
-- =============================================================================

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

-- =============================================================================
-- EXPERIMENT CHALLENGES POLICIES
-- =============================================================================

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

-- =============================================================================
-- EXPERIMENT NEXT STEPS POLICIES
-- =============================================================================

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

-- =============================================================================
-- EXPERIMENT TECHNOLOGIES POLICIES
-- =============================================================================

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

-- =============================================================================
-- EXPERIMENT TAGS POLICIES
-- =============================================================================

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

-- =============================================================================
-- EXPERIMENT CATEGORIES POLICIES
-- =============================================================================

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
-- PROFILES ADDITIONAL POLICIES
-- =============================================================================

-- Allow profile creation on signup (via trigger)
CREATE POLICY "profiles_insert_signup" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- PRODUCT VERSIONS POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT FEATURES POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT INCLUDES POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT REQUIREMENTS POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT CHANGELOG POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT FAQ POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT TECHNOLOGIES POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT COMPATIBILITY POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT CATEGORIES POLICIES
-- =============================================================================

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

-- =============================================================================
-- PRODUCT ASSETS POLICIES
-- =============================================================================

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

-- =============================================================================
-- EXPERIMENTS INSIGHTS/CHALLENGES/NEXT STEPS/TECHNOLOGIES/TAGS/CATEGORIES
-- =============================================================================

-- Insights
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

-- Challenges
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

-- Next Steps
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

-- Technologies
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

-- Tags
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

-- Categories
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
-- PROJECT RELATED TABLES
-- =============================================================================

-- Project timeline events
CREATE POLICY "project_timeline_events_select_public" ON project_timeline_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE projects.id = project_timeline_events.project_id
            AND projects.published_at IS NOT NULL
            AND projects.status IN ('active', 'coming_soon')
        )
    );

CREATE POLICY "project_timeline_events_all_admin" ON project_timeline_events
    FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Project features
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

-- =============================================================================
-- EXPERIMENT RELATED TABLES
-- =============================================================================

-- Experiment insights
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
-- EXPERIMENT CHALLENGES
-- =============================================================================

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

-- =============================================================================
-- EXPERIMENT NEXT STEPS
-- =============================================================================

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

-- =============================================================================
-- EXPERIMENT TECHNOLOGIES
-- =============================================================================

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

-- =============================================================================
-- EXPERIMENT TAGS
-- =============================================================================

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

-- =============================================================================
-- EXPERIMENT CATEGORIES
-- =============================================================================

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