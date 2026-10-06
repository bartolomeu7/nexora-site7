import { createServerClient } from '@/lib/supabase/server';
import { checkAdminRole } from './admin-auth';
import type { ProjectStatus } from './projects';

export interface AdminProjectInput {
  slug: string;
  title: string;
  short_description?: string;
  description?: string;
  long_description?: string;
  status: ProjectStatus;
  thumbnail_url?: string;
  hero_image_url?: string;
  repository_url?: string;
  demo_url?: string;
  docs_url?: string;
  started_at?: string;
  technologies?: string[];
  features?: string[];
  timeline?: Array<{
    date: string;
    title: string;
    description?: string;
    type: 'milestone' | 'release' | 'update' | 'planning';
  }>;
}

export interface AdminProjectCategoryRelation {
  name: string;
  slug: string;
}

export interface AdminProjectCategoryRow {
  categories: AdminProjectCategoryRelation | null;
}

export interface AdminProjectTechnologyRow {
  technology: string;
}

export interface AdminProjectFeatureRow {
  feature: string;
}

export interface AdminProjectTimelineRow {
  date: string;
  title: string;
  description: string | null;
  type: 'milestone' | 'release' | 'update' | 'planning';
}

export interface AdminProjectRow {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  long_description: string | null;
  status: ProjectStatus;
  thumbnail_url: string | null;
  hero_image_url: string | null;
  repository_url: string | null;
  demo_url: string | null;
  docs_url: string | null;
  started_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  project_categories: AdminProjectCategoryRow[];
  project_technologies: AdminProjectTechnologyRow[];
  project_features: AdminProjectFeatureRow[];
  project_timeline_events: AdminProjectTimelineRow[];
}

export interface AdminProjectResult {
  success: boolean;
  error?: string;
  data?: AdminProjectRow | { id: string; slug: string };
}

export async function getAdminProjects(): Promise<{ data: AdminProjectRow[] | null; error: string | null }> {
  const client = createServerClient();
  if (!client) {
    return { data: null, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { data: null, error: authCheck.error || 'Not authorized' };
  }

  const { data, error } = await client
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
    return { data: null, error: error.message };
  }

  return { data: data as AdminProjectRow[], error: null };
}

export async function getAdminProject(slug: string): Promise<{ data: AdminProjectRow | null; error: string | null }> {
  const client = createServerClient();
  if (!client) {
    return { data: null, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { data: null, error: authCheck.error || 'Not authorized' };
  }

  const { data, error } = await client
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
    if (error.code === 'PGRST116') {
      return { data: null, error: 'Project not found' };
    }
    return { data: null, error: error.message };
  }

  return { data: data as AdminProjectRow, error: null };
}

export async function createAdminProject(input: AdminProjectInput): Promise<AdminProjectResult> {
  const client = createServerClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: project, error: projectError } = await client
    .from('projects')
    .insert({
      slug: input.slug,
      title: input.title,
      short_description: input.short_description,
      description: input.description,
      long_description: input.long_description,
      status: input.status,
      thumbnail_url: input.thumbnail_url,
      hero_image_url: input.hero_image_url,
      repository_url: input.repository_url,
      demo_url: input.demo_url,
      docs_url: input.docs_url,
      started_at: input.started_at,
    })
    .select()
    .single();

  if (projectError) {
    return { success: false, error: projectError.message };
  }

  const created = project as AdminProjectRow;

  if (input.technologies && input.technologies.length > 0) {
    const { error: techError } = await client
      .from('project_technologies')
      .insert(
        input.technologies.map(tech => ({
          project_id: created.id,
          technology: tech,
        }))
      );

    if (techError) {
      return { success: false, error: techError.message };
    }
  }

  if (input.features && input.features.length > 0) {
    const { error: featureError } = await client
      .from('project_features')
      .insert(
        input.features.map(feature => ({
          project_id: created.id,
          feature: feature,
        }))
      );

    if (featureError) {
      return { success: false, error: featureError.message };
    }
  }

  if (input.timeline && input.timeline.length > 0) {
    const { error: timelineError } = await client
      .from('project_timeline_events')
      .insert(
        input.timeline.map(event => ({
          project_id: created.id,
          date: event.date,
          title: event.title,
          description: event.description,
          type: event.type,
        }))
      );

    if (timelineError) {
      return { success: false, error: timelineError.message };
    }
  }

  return { success: true, data: created };
}

export async function updateAdminProject(slug: string, input: Partial<AdminProjectInput>): Promise<AdminProjectResult> {
  const client = createServerClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: project, error: projectError } = await client
    .from('projects')
    .update({
      title: input.title,
      short_description: input.short_description,
      description: input.description,
      long_description: input.long_description,
      status: input.status,
      thumbnail_url: input.thumbnail_url,
      hero_image_url: input.hero_image_url,
      repository_url: input.repository_url,
      demo_url: input.demo_url,
      docs_url: input.docs_url,
      started_at: input.started_at,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .select()
    .single();

  if (projectError) {
    return { success: false, error: projectError.message };
  }

  return { success: true, data: project as AdminProjectRow };
}

export async function publishAdminProject(slug: string): Promise<AdminProjectResult> {
  const client = createServerClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: project, error: projectError } = await client
    .from('projects')
    .update({
      published_at: new Date().toISOString(),
      status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .select()
    .single();

  if (projectError) {
    return { success: false, error: projectError.message };
  }

  return { success: true, data: project as AdminProjectRow };
}

export async function unpublishAdminProject(slug: string): Promise<AdminProjectResult> {
  const client = createServerClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: project, error: projectError } = await client
    .from('projects')
    .update({
      published_at: null,
      status: 'draft',
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .select()
    .single();

  if (projectError) {
    return { success: false, error: projectError.message };
  }

  return { success: true, data: project as AdminProjectRow };
}

export async function deleteAdminProject(slug: string): Promise<AdminProjectResult> {
  const client = createServerClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: project, error: projectError } = await client
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .single();

  if (projectError) {
    return { success: false, error: projectError.message };
  }

  const found = project as { id: string };

  const { error: deleteError } = await client
    .from('projects')
    .delete()
    .eq('slug', slug);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  return { success: true, data: { id: found.id, slug } };
}
