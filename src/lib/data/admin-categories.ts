import { createServerClient } from '@/lib/supabase/server';
import { checkAdminRole } from './admin-auth';

export interface AdminCategoryInput {
  name: string;
  slug: string;
  description?: string;
  type?: string;
}

export interface AdminCategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminCategoryResult {
  success: boolean;
  error?: string;
  data?: AdminCategoryRow | { id: string; slug: string };
}

interface RelationRow {
  project_id?: string;
  product_id?: string;
  experiment_id?: string;
}

export async function getAdminCategories(): Promise<{ data: AdminCategoryRow[] | null; error: string | null }> {
  const client = createServerClient();
  if (!client) {
    return { data: null, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { data: null, error: authCheck.error || 'Not authorized' };
  }

  const { data, error } = await client
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as AdminCategoryRow[], error: null };
}

export async function getAdminCategory(slug: string): Promise<{ data: AdminCategoryRow | null; error: string | null }> {
  const client = createServerClient();
  if (!client) {
    return { data: null, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { data: null, error: authCheck.error || 'Not authorized' };
  }

  const { data, error } = await client
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { data: null, error: 'Category not found' };
    }
    return { data: null, error: error.message };
  }

  return { data: data as AdminCategoryRow, error: null };
}

export async function createAdminCategory(input: AdminCategoryInput): Promise<AdminCategoryResult> {
  const client = createServerClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: category, error: categoryError } = await client
    .from('categories')
    .insert({
      name: input.name,
      slug: input.slug,
      description: input.description,
      type: input.type,
    })
    .select()
    .single();

  if (categoryError) {
    return { success: false, error: categoryError.message };
  }

  return { success: true, data: category as AdminCategoryRow };
}

export async function updateAdminCategory(slug: string, input: Partial<AdminCategoryInput>): Promise<AdminCategoryResult> {
  const client = createServerClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: category, error: categoryError } = await client
    .from('categories')
    .update({
      name: input.name,
      slug: input.slug,
      description: input.description,
      type: input.type,
    })
    .eq('slug', slug)
    .select()
    .single();

  if (categoryError) {
    return { success: false, error: categoryError.message };
  }

  return { success: true, data: category as AdminCategoryRow };
}

export async function deleteAdminCategory(slug: string): Promise<AdminCategoryResult> {
  const client = createServerClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  // Check for existing relationships before deleting.
  const { data: relationships, error: relError } = await client
    .from('project_categories')
    .select('project_id')
    .eq('category_id', slug);

  if (relError) {
    return { success: false, error: 'Failed to check relationships' };
  }

  const projectRels = (relationships ?? []) as RelationRow[];
  if (projectRels.length > 0) {
    return { success: false, error: 'Cannot delete category with existing project relationships' };
  }

  const { data: productRelationships, error: prodRelError } = await client
    .from('product_categories')
    .select('product_id')
    .eq('category_id', slug);

  if (prodRelError) {
    return { success: false, error: 'Failed to check relationships' };
  }

  const productRels = (productRelationships ?? []) as RelationRow[];
  if (productRels.length > 0) {
    return { success: false, error: 'Cannot delete category with existing product relationships' };
  }

  const { data: experimentRelationships, error: expRelError } = await client
    .from('experiment_categories')
    .select('experiment_id')
    .eq('category_id', slug);

  if (expRelError) {
    return { success: false, error: 'Failed to check relationships' };
  }

  const experimentRels = (experimentRelationships ?? []) as RelationRow[];
  if (experimentRels.length > 0) {
    return { success: false, error: 'Cannot delete category with existing experiment relationships' };
  }

  const { data: category, error: categoryError } = await client
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single();

  if (categoryError) {
    return { success: false, error: categoryError.message };
  }

  const found = category as { id: string };

  const { error: deleteError } = await client
    .from('categories')
    .delete()
    .eq('slug', slug);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  return { success: true, data: { id: found.id, slug } };
}
