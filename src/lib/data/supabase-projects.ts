import { createServerClient } from '@/lib/supabase/server';
import type { Project, ProjectStatus, ProjectCategory } from './projects';

export type ProjectWithRelations = Project & {
    categories: string[];
    technologies: string[];
    features: string[];
    timeline: Array<{
        date: string;
        title: string;
        description: string;
        type: 'milestone' | 'release' | 'update' | 'planning';
    }>;
    thumbnail?: string;
};

// Supabase response types
interface ProjectCategoryRow {
    categories: {
        name: string;
        slug: string;
    } | null;
}

interface ProjectTechnologyRow {
    technology: string;
}

interface ProjectFeatureRow {
    feature: string;
}

interface ProjectTimelineEventRow {
    date: string;
    title: string;
    description: string | null;
    type: 'milestone' | 'release' | 'update' | 'planning';
}

interface ProjectRow {
    slug: string;
    title: string;
    short_description: string | null;
    description: string | null;
    long_description: string | null;
    status: ProjectStatus;
    featured: boolean;
    thumbnail_url: string | null;
    hero_image_url: string | null;
    repository_url: string | null;
    demo_url: string | null;
    docs_url: string | null;
    started_at: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    project_categories: ProjectCategoryRow[];
    project_technologies: ProjectTechnologyRow[];
    project_features: ProjectFeatureRow[];
    project_timeline_events: ProjectTimelineEventRow[];
}

interface ProjectCategoryRow {
    categories: {
        name: string;
        slug: string;
    } | null;
}

interface ProjectTechnologyRow {
    technology: string;
}

interface ProjectFeatureRow {
    feature: string;
}

interface ProjectTimelineEventRow {
    date: string;
    title: string;
    description: string | null;
    type: 'milestone' | 'release' | 'update' | 'planning';
}

function toISODate(dateStr: string | null): string {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    try {
        return new Date(dateStr).toISOString().split('T')[0];
    } catch {
        return new Date().toISOString().split('T')[0];
    }
}

export async function getAllProjectsSupabase(): Promise<ProjectWithRelations[]> {
    const client = createServerClient();
    if (!client) {
        console.warn('Supabase not configured, falling back to mock data');
        const { getAllProjects } = await import('./projects');
        return getAllProjects().map(p => ({
            ...p,
            categories: [p.category],
            technologies: p.technologies,
            features: p.features,
            timeline: p.timeline
        }));
    }

    const { data: projects, error } = await client
        .from('projects')
        .select(`
            *,
            project_categories (
                categories (name, slug)
            ),
            project_technologies (technology),
            project_features (feature),
            project_timeline_events (date, title, description, type)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }

    return (projects as ProjectRow[]).map(p => ({
        slug: p.slug,
        name: p.title,
        description: p.short_description || '',
        longDescription: p.long_description || p.description || '',
        category: (p.project_categories?.[0]?.categories?.name as ProjectCategory) || 'Platform',
        categories: (p.project_categories?.map((pc: ProjectCategoryRow) => pc.categories?.name).filter((n): n is string => Boolean(n)) || []) as string[],
        status: p.status,
        technologies: p.project_technologies?.map((t: ProjectTechnologyRow) => t.technology) || [],
        thumbnail: p.thumbnail_url ?? undefined,
        gallery: p.hero_image_url ? [p.hero_image_url] : [],
        features: p.project_features?.map((f: ProjectFeatureRow) => f.feature) || [],
        timeline: p.project_timeline_events?.map((t: ProjectTimelineEventRow) => ({
            date: t.date,
            title: t.title,
            description: t.description || '',
            type: t.type as 'milestone' | 'release' | 'update' | 'planning'
        })) || [],
        cta: {
            label: p.repository_url ? 'View on GitHub' : 'Learn More',
            href: p.repository_url || p.docs_url || '/contact'
        },
        startedAt: toISODate(p.started_at),
        updatedAt: toISODate(p.updated_at),
        links: {
            github: p.repository_url ?? undefined,
            demo: p.demo_url ?? undefined,
            docs: p.docs_url ?? undefined
        }
    }));
}

export async function getProjectSupabase(slug: string) {
    const client = createServerClient();
    if (!client) {
        const { getProject } = await import('./projects');
        return getProject(slug);
    }

    const { data: project, error } = await client
        .from('projects')
        .select(`
            *,
            project_categories (
                categories (name, slug)
            ),
            project_technologies (technology),
            project_features (feature),
            project_timeline_events (date, title, description, type)
        `)
        .eq('slug', slug)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }

    if (!project) return null;

    const p = project as ProjectRow;

    return {
        slug: p.slug,
        name: p.title,
        description: p.short_description || '',
        longDescription: p.long_description || p.description || '',
        category: (p.project_categories?.[0]?.categories?.name as ProjectCategory) || 'Platform',
        categories: p.project_categories?.map((pc: ProjectCategoryRow) => pc.categories?.name).filter(Boolean) || [],
        status: p.status,
        technologies: p.project_technologies?.map((t: ProjectTechnologyRow) => t.technology) || [],
        thumbnail: p.thumbnail_url ?? undefined,
        gallery: p.hero_image_url ? [p.hero_image_url] : [],
        features: p.project_features?.map((f: ProjectFeatureRow) => f.feature) || [],
        timeline: p.project_timeline_events?.map((t: ProjectTimelineEventRow) => ({
            date: t.date,
            title: t.title,
            description: t.description || '',
            type: t.type as 'milestone' | 'release' | 'update' | 'planning'
        })) || [],
        cta: {
            label: p.repository_url ? 'View on GitHub' : 'Learn More',
            href: p.repository_url || p.docs_url || '/contact'
        },
        startedAt: toISODate(p.started_at),
        updatedAt: toISODate(p.updated_at),
        links: {
            github: p.repository_url ?? undefined,
            demo: p.demo_url ?? undefined,
            docs: p.docs_url ?? undefined
        }
    };
}

export async function getProjectsByStatusSupabase(status: string) {
    const client = createServerClient();
    if (!client) {
        const { getProjectsByStatus } = await import('./projects');
        return getProjectsByStatus(status as ProjectStatus);
    }

    const { data, error } = await client
        .from('projects')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getProjectsByCategorySupabase(category: string) {
    const client = createServerClient();
    if (!client) {
        const { getProjectsByCategory } = await import('./projects');
        return getProjectsByCategory(category as ProjectCategory);
    }

    const { data, error } = await client
        .from('projects')
        .select(`
            *,
            project_categories!inner (
                category_id
            )
        `)
        .eq('project_categories.category_id', (async () => {
            const client2 = createServerClient();
            if (!client2) return '';
            const { data } = await client2.from('categories').select('id').eq('slug', category).single();
            return data?.id || '';
        })())
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}