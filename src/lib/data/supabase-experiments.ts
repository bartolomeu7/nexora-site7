import { createServerClient } from '@/lib/supabase/server';
import type { Experiment, ExperimentStatus, ExperimentCategory } from './experiments';

export type ExperimentWithRelations = Experiment & {
    categories: string[];
    technologies: string[];
    insights: string[];
    challenges: string[];
    nextSteps: string[];
    tags: string[];
    thumbnail?: string;
};

// Supabase response types
interface ExperimentCategoryRow {
    categories: {
        name: string;
        slug: string;
    } | null;
}

interface ExperimentTechnologyRow {
    technology: string;
}

interface ExperimentInsightRow {
    insight: string;
}

interface ExperimentChallengeRow {
    challenge: string;
}

interface ExperimentNextStepRow {
    step: string;
}

interface ExperimentTagRow {
    tag: string;
}

interface ExperimentRow {
    slug: string;
    title: string;
    description: string | null;
    long_description: string | null;
    status: ExperimentStatus;
    thumbnail_url: string | null;
    demo_url: string | null;
    article_url: string | null;
    paper_url: string | null;
    github_url: string | null;
    started_at: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    experiment_categories: ExperimentCategoryRow[];
    experiment_technologies: ExperimentTechnologyRow[];
    experiment_insights: ExperimentInsightRow[];
    experiment_challenges: ExperimentChallengeRow[];
    experiment_next_steps: ExperimentNextStepRow[];
    experiment_tags: ExperimentTagRow[];
}

interface ExperimentCategoryRow {
    categories: {
        name: string;
        slug: string;
    } | null;
}

interface ExperimentTechnologyRow {
    technology: string;
}

interface ExperimentInsightRow {
    insight: string;
}

interface ExperimentChallengeRow {
    challenge: string;
}

interface ExperimentNextStepRow {
    step: string;
}

interface ExperimentTagRow {
    tag: string;
}

function toISODate(dateStr: string | null): string {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    try {
        return new Date(dateStr).toISOString().split('T')[0];
    } catch {
        return new Date().toISOString().split('T')[0];
    }
}

export async function getAllExperimentsSupabase(): Promise<ExperimentWithRelations[]> {
    const client = createServerClient();
    if (!client) {
        console.warn('Supabase not configured, falling back to mock data');
        const { getAllExperiments } = await import('./experiments');
        return getAllExperiments().map(e => ({
            ...e,
            categories: [e.category],
            technologies: e.technologies,
            insights: e.insights,
            challenges: e.challenges,
            nextSteps: e.nextSteps,
            tags: e.tags
        }));
    }

    const { data: experiments, error } = await client
        .from('experiments')
        .select(`
            *,
            experiment_categories (
                categories (name, slug)
            ),
            experiment_technologies (technology),
            experiment_insights (insight),
            experiment_challenges (challenge),
            experiment_next_steps (step),
            experiment_tags (tag)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching experiments:', error);
        throw error;
    }

    return (experiments as ExperimentRow[]).map((e: ExperimentRow) => ({
        slug: e.slug,
        name: e.title,
        description: e.description || '',
        longDescription: e.long_description || e.description || '',
        category: (e.experiment_categories?.[0]?.categories?.name as ExperimentCategory) || 'Research',
        categories: (e.experiment_categories?.map((ec: ExperimentCategoryRow) => ec.categories?.name).filter((n): n is string => Boolean(n)) || []) as string[],
        status: e.status,
        technologies: e.experiment_technologies?.map((t: ExperimentTechnologyRow) => t.technology) || [],
        thumbnail: e.thumbnail_url ?? undefined,
        gallery: e.thumbnail_url ? [e.thumbnail_url] : [],
        insights: e.experiment_insights?.map((i: ExperimentInsightRow) => i.insight) || [],
        challenges: e.experiment_challenges?.map((c: ExperimentChallengeRow) => c.challenge) || [],
        nextSteps: e.experiment_next_steps?.map((s: ExperimentNextStepRow) => s.step) || [],
        startedAt: toISODate(e.started_at),
        updatedAt: toISODate(e.updated_at),
        links: {
            github: e.github_url ?? undefined,
            demo: e.demo_url ?? undefined,
            article: e.article_url ?? undefined,
            paper: e.paper_url ?? undefined
        },
        tags: e.experiment_tags?.map((t: ExperimentTagRow) => t.tag) || []
    }));
}

export async function getExperimentSupabase(slug: string) {
    const client = createServerClient();
    if (!client) {
        const { getExperiment } = await import('./experiments');
        return getExperiment(slug);
    }

    const { data: experiment, error } = await client
        .from('experiments')
        .select(`
            *,
            experiment_categories (
                categories (name, slug)
            ),
            experiment_technologies (technology),
            experiment_insights (insight),
            experiment_challenges (challenge),
            experiment_next_steps (step),
            experiment_tags (tag)
        `)
        .eq('slug', slug)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }

    if (!experiment) return null;

    if (!experiment) return null;

    const e = experiment;

    return {
        slug: e.slug,
        name: e.title,
        description: e.description || '',
        longDescription: e.long_description || e.description || '',
        category: (e.experiment_categories?.[0]?.categories?.name as ExperimentCategory) || 'Research',
        categories: (e.experiment_categories?.map((ec: ExperimentCategoryRow) => ec.categories?.name).filter((n: string | undefined): n is string => Boolean(n)) || []) as string[],
        status: e.status,
        technologies: e.experiment_technologies?.map((t: ExperimentTechnologyRow) => t.technology) || [],
        thumbnail: e.thumbnail_url ?? undefined,
        gallery: e.thumbnail_url ? [e.thumbnail_url] : [],
        insights: e.experiment_insights?.map((i: ExperimentInsightRow) => i.insight) || [],
        challenges: e.experiment_challenges?.map((c: ExperimentChallengeRow) => c.challenge) || [],
        nextSteps: e.experiment_next_steps?.map((s: ExperimentNextStepRow) => s.step) || [],
        startedAt: toISODate(e.started_at),
        updatedAt: toISODate(e.updated_at),
        links: {
            github: e.github_url ?? undefined,
            demo: e.demo_url ?? undefined,
            article: e.article_url ?? undefined,
            paper: e.paper_url ?? undefined
        },
        tags: e.experiment_tags?.map((t: ExperimentTagRow) => t.tag) || []
    };
}

export async function getExperimentsByStatusSupabase(status: string) {
    const client = createServerClient();
    if (!client) {
        const { getExperimentsByStatus } = await import('./experiments');
        return getExperimentsByStatus(status as ExperimentStatus);
    }

    const { data, error } = await client
        .from('experiments')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getExperimentsByCategorySupabase(category: string) {
    const client = createServerClient();
    if (!client) {
        const { getExperimentsByCategory } = await import('./experiments');
        return getExperimentsByCategory(category as ExperimentCategory);
    }

    const { data, error } = await client
        .from('experiments')
        .select(`
            *,
            experiment_categories!inner (
                category_id
            )
        `)
        .eq('experiment_categories.category_id', (async () => {
            const client2 = createServerClient();
            if (!client2) return '';
            const { data } = await client2.from('categories').select('id').eq('slug', category).single();
            return data?.id || '';
        })())
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}