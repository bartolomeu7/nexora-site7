import { createServerClient } from '@/lib/supabase/server';
import { checkAdminRole } from './admin-auth';
import type { ExperimentStatus } from './experiments';

export interface AdminExperimentInput {
  slug: string;
  title: string;
  description?: string;
  long_description?: string;
  status: ExperimentStatus;
  thumbnail_url?: string;
  demo_url?: string;
  article_url?: string;
  paper_url?: string;
  github_url?: string;
  started_at?: string;
  technologies?: string[];
  insights?: string[];
  challenges?: string[];
  next_steps?: string[];
  tags?: string[];
}

export interface AdminExperimentCategoryRelation {
  name: string;
  slug: string;
}

export interface AdminExperimentCategoryRow {
  categories: AdminExperimentCategoryRelation | null;
}

export interface AdminExperimentTechnologyRow {
  technology: string;
}

export interface AdminExperimentInsightRow {
  insight: string;
}

export interface AdminExperimentChallengeRow {
  challenge: string;
}

export interface AdminExperimentNextStepRow {
  step: string;
}

export interface AdminExperimentTagRow {
  tag: string;
}

export interface AdminExperimentRow {
  id: string;
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
  experiment_categories: AdminExperimentCategoryRow[];
  experiment_technologies: AdminExperimentTechnologyRow[];
  experiment_insights: AdminExperimentInsightRow[];
  experiment_challenges: AdminExperimentChallengeRow[];
  experiment_next_steps: AdminExperimentNextStepRow[];
  experiment_tags: AdminExperimentTagRow[];
}

export interface AdminExperimentResult {
  success: boolean;
  error?: string;
  data?: AdminExperimentRow | { id: string; slug: string };
}

export async function getAdminExperiments(): Promise<{ data: AdminExperimentRow[] | null; error: string | null }> {
  const client = createServerClient();
  if (!client) {
    return { data: null, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { data: null, error: authCheck.error || 'Not authorized' };
  }

  const { data, error } = await client
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
    return { data: null, error: error.message };
  }

  return { data: data as AdminExperimentRow[], error: null };
}

export async function getAdminExperiment(slug: string): Promise<{ data: AdminExperimentRow | null; error: string | null }> {
  const client = createServerClient();
  if (!client) {
    return { data: null, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { data: null, error: authCheck.error || 'Not authorized' };
  }

  const { data, error } = await client
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
    if (error.code === 'PGRST116') {
      return { data: null, error: 'Experiment not found' };
    }
    return { data: null, error: error.message };
  }

  return { data: data as AdminExperimentRow, error: null };
}

export async function createAdminExperiment(input: AdminExperimentInput): Promise<AdminExperimentResult> {
  const client = createServerClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: experiment, error: experimentError } = await client
    .from('experiments')
    .insert({
      slug: input.slug,
      title: input.title,
      description: input.description,
      long_description: input.long_description,
      status: input.status,
      thumbnail_url: input.thumbnail_url,
      demo_url: input.demo_url,
      article_url: input.article_url,
      paper_url: input.paper_url,
      github_url: input.github_url,
      started_at: input.started_at,
    })
    .select()
    .single();

  if (experimentError) {
    return { success: false, error: experimentError.message };
  }

  const created = experiment as AdminExperimentRow;

  if (input.technologies && input.technologies.length > 0) {
    const { error: techError } = await client
      .from('experiment_technologies')
      .insert(
        input.technologies.map(tech => ({
          experiment_id: created.id,
          technology: tech,
        }))
      );

    if (techError) {
      return { success: false, error: techError.message };
    }
  }

  if (input.insights && input.insights.length > 0) {
    const { error: insightError } = await client
      .from('experiment_insights')
      .insert(
        input.insights.map(insight => ({
          experiment_id: created.id,
          insight: insight,
        }))
      );

    if (insightError) {
      return { success: false, error: insightError.message };
    }
  }

  if (input.challenges && input.challenges.length > 0) {
    const { error: challengeError } = await client
      .from('experiment_challenges')
      .insert(
        input.challenges.map(challenge => ({
          experiment_id: created.id,
          challenge: challenge,
        }))
      );

    if (challengeError) {
      return { success: false, error: challengeError.message };
    }
  }

  if (input.next_steps && input.next_steps.length > 0) {
    const { error: stepError } = await client
      .from('experiment_next_steps')
      .insert(
        input.next_steps.map(step => ({
          experiment_id: created.id,
          step: step,
        }))
      );

    if (stepError) {
      return { success: false, error: stepError.message };
    }
  }

  if (input.tags && input.tags.length > 0) {
    const { error: tagError } = await client
      .from('experiment_tags')
      .insert(
        input.tags.map(tag => ({
          experiment_id: created.id,
          tag: tag,
        }))
      );

    if (tagError) {
      return { success: false, error: tagError.message };
    }
  }

  return { success: true, data: created };
}

export async function updateAdminExperiment(slug: string, input: Partial<AdminExperimentInput>): Promise<AdminExperimentResult> {
  const client = createServerClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: experiment, error: experimentError } = await client
    .from('experiments')
    .update({
      title: input.title,
      description: input.description,
      long_description: input.long_description,
      status: input.status,
      thumbnail_url: input.thumbnail_url,
      demo_url: input.demo_url,
      article_url: input.article_url,
      paper_url: input.paper_url,
      github_url: input.github_url,
      started_at: input.started_at,
    })
    .eq('slug', slug)
    .select()
    .single();

  if (experimentError) {
    return { success: false, error: experimentError.message };
  }

  return { success: true, data: experiment as AdminExperimentRow };
}

export async function publishAdminExperiment(slug: string): Promise<AdminExperimentResult> {
  const client = createServerClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: experiment, error: experimentError } = await client
    .from('experiments')
    .update({
      published_at: new Date().toISOString(),
      status: 'validating',
    })
    .eq('slug', slug)
    .select()
    .single();

  if (experimentError) {
    return { success: false, error: experimentError.message };
  }

  return { success: true, data: experiment as AdminExperimentRow };
}

export async function unpublishAdminExperiment(slug: string): Promise<AdminExperimentResult> {
  const client = createServerClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: experiment, error: experimentError } = await client
    .from('experiments')
    .update({
      published_at: null,
      status: 'draft',
    })
    .eq('slug', slug)
    .select()
    .single();

  if (experimentError) {
    return { success: false, error: experimentError.message };
  }

  return { success: true, data: experiment as AdminExperimentRow };
}

export async function deleteAdminExperiment(slug: string): Promise<AdminExperimentResult> {
  const client = createServerClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: experiment, error: experimentError } = await client
    .from('experiments')
    .select('id')
    .eq('slug', slug)
    .single();

  if (experimentError) {
    return { success: false, error: experimentError.message };
  }

  const found = experiment as { id: string };

  const { error: deleteError } = await client
    .from('experiments')
    .delete()
    .eq('slug', slug);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  return { success: true, data: { id: found.id, slug } };
}
