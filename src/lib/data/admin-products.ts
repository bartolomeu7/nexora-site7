import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAdminRole } from './admin-auth';
import type { ProductStatus } from './products';

export type ProductCurrency = 'USD' | 'EUR' | 'BRL';

export const PRODUCT_CURRENCIES: readonly ProductCurrency[] = ['USD', 'EUR', 'BRL'] as const;

export function parseProductCurrency(value: unknown): ProductCurrency {
  if (value === 'EUR') return 'EUR';
  if (value === 'BRL') return 'BRL';
  return 'USD';
}

export interface AdminProductInput {
  slug: string;
  title: string;
  short_description?: string;
  description?: string;
  long_description?: string;
  status: ProductStatus;
  price: number;
  original_price?: number;
  currency: ProductCurrency;
  version?: string;
  last_updated?: string;
  thumbnail_url?: string;
  hero_image_url?: string;
  technologies?: string[];
  compatibility?: string[];
  features?: string[];
  includes?: string[];
  requirements?: string[];
  changelog?: Array<{
    version: string;
    date: string;
    changes: string[];
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface AdminProductCategoryRelation {
  name: string;
  slug: string;
}

export interface AdminProductCategoryRow {
  categories: AdminProductCategoryRelation | null;
}

export interface AdminProductTechnologyRow {
  technology: string;
}

export interface AdminProductCompatibilityRow {
  platform: string;
}

export interface AdminProductFeatureRow {
  feature: string;
}

export interface AdminProductIncludeRow {
  include_item: string;
}

export interface AdminProductRequirementRow {
  requirement: string;
}

export interface AdminProductChangelogRow {
  version: string;
  date: string;
  changes: string[];
}

export interface AdminProductFaqRow {
  question: string;
  answer: string;
}

export interface AdminProductRow {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  long_description: string | null;
  status: ProductStatus;
  price: number | string;
  original_price: number | string | null;
  currency: ProductCurrency;
  version: string | null;
  last_updated: string | null;
  thumbnail_url: string | null;
  hero_image_url: string | null;
  repository_url: string | null;
  demo_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  product_categories: AdminProductCategoryRow[];
  product_technologies: AdminProductTechnologyRow[];
  product_compatibility: AdminProductCompatibilityRow[];
  product_features: AdminProductFeatureRow[];
  product_includes: AdminProductIncludeRow[];
  product_requirements: AdminProductRequirementRow[];
  product_changelog: AdminProductChangelogRow[];
  product_faq: AdminProductFaqRow[];
}

export interface AdminProductResult {
  success: boolean;
  error?: string;
  data?: AdminProductRow | { id: string; slug: string };
}

export async function getAdminProducts(): Promise<{ data: AdminProductRow[] | null; error: string | null }> {
  const client = createServerSupabaseClient();
  if (!client) {
    return { data: null, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { data: null, error: authCheck.error || 'Not authorized' };
  }

  const { data, error } = await client
    .from('products')
    .select(`
      *,
      product_categories (
        categories (name, slug)
      ),
      product_technologies (technology),
      product_compatibility (platform),
      product_features (feature),
      product_includes (include_item),
      product_requirements (requirement),
      product_changelog (version, date, changes),
      product_faq (question, answer)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as AdminProductRow[], error: null };
}

export async function getAdminProduct(slug: string): Promise<{ data: AdminProductRow | null; error: string | null }> {
  const client = createServerSupabaseClient();
  if (!client) {
    return { data: null, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { data: null, error: authCheck.error || 'Not authorized' };
  }

  const { data, error } = await client
    .from('products')
    .select(`
      *,
      product_categories (
        categories (name, slug)
      ),
      product_technologies (technology),
      product_compatibility (platform),
      product_features (feature),
      product_includes (include_item),
      product_requirements (requirement),
      product_changelog (version, date, changes),
      product_faq (question, answer)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { data: null, error: 'Product not found' };
    }
    return { data: null, error: error.message };
  }

  return { data: data as AdminProductRow, error: null };
}

export async function createAdminProduct(input: AdminProductInput): Promise<AdminProductResult> {
  const client = createServerSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: product, error: productError } = await client
    .from('products')
    .insert({
      slug: input.slug,
      title: input.title,
      short_description: input.short_description,
      description: input.description,
      long_description: input.long_description,
      status: input.status,
      price: input.price,
      original_price: input.original_price,
      currency: input.currency,
      version: input.version,
      last_updated: input.last_updated,
      thumbnail_url: input.thumbnail_url,
      hero_image_url: input.hero_image_url,
    })
    .select()
    .single();

  if (productError) {
    return { success: false, error: productError.message };
  }

  const created = product as AdminProductRow;

  if (input.technologies && input.technologies.length > 0) {
    const { error: techError } = await client
      .from('product_technologies')
      .insert(
        input.technologies.map(tech => ({
          product_id: created.id,
          technology: tech,
        }))
      );

    if (techError) {
      return { success: false, error: techError.message };
    }
  }

  if (input.compatibility && input.compatibility.length > 0) {
    const { error: compatError } = await client
      .from('product_compatibility')
      .insert(
        input.compatibility.map(platform => ({
          product_id: created.id,
          platform: platform,
        }))
      );

    if (compatError) {
      return { success: false, error: compatError.message };
    }
  }

  if (input.features && input.features.length > 0) {
    const { error: featureError } = await client
      .from('product_features')
      .insert(
        input.features.map(feature => ({
          product_id: created.id,
          feature: feature,
        }))
      );

    if (featureError) {
      return { success: false, error: featureError.message };
    }
  }

  if (input.includes && input.includes.length > 0) {
    const { error: includeError } = await client
      .from('product_includes')
      .insert(
        input.includes.map(item => ({
          product_id: created.id,
          include_item: item,
        }))
      );

    if (includeError) {
      return { success: false, error: includeError.message };
    }
  }

  if (input.requirements && input.requirements.length > 0) {
    const { error: requirementError } = await client
      .from('product_requirements')
      .insert(
        input.requirements.map(req => ({
          product_id: created.id,
          requirement: req,
        }))
      );

    if (requirementError) {
      return { success: false, error: requirementError.message };
    }
  }

  if (input.changelog && input.changelog.length > 0) {
    const { error: changelogError } = await client
      .from('product_changelog')
      .insert(
        input.changelog.map(entry => ({
          product_id: created.id,
          version: entry.version,
          date: entry.date,
          changes: entry.changes,
        }))
      );

    if (changelogError) {
      return { success: false, error: changelogError.message };
    }
  }

  if (input.faq && input.faq.length > 0) {
    const { error: faqError } = await client
      .from('product_faq')
      .insert(
        input.faq.map(entry => ({
          product_id: created.id,
          question: entry.question,
          answer: entry.answer,
        }))
      );

    if (faqError) {
      return { success: false, error: faqError.message };
    }
  }

  return { success: true, data: created };
}

export async function updateAdminProduct(slug: string, input: Partial<AdminProductInput>): Promise<AdminProductResult> {
  const client = createServerSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: product, error: productError } = await client
    .from('products')
    .update({
      title: input.title,
      short_description: input.short_description,
      description: input.description,
      long_description: input.long_description,
      status: input.status,
      price: input.price,
      original_price: input.original_price,
      currency: input.currency,
      version: input.version,
      last_updated: input.last_updated,
      thumbnail_url: input.thumbnail_url,
      hero_image_url: input.hero_image_url,
    })
    .eq('slug', slug)
    .select()
    .single();

  if (productError) {
    return { success: false, error: productError.message };
  }

  return { success: true, data: product as AdminProductRow };
}

export async function publishAdminProduct(slug: string): Promise<AdminProductResult> {
  const client = createServerSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: product, error: productError } = await client
    .from('products')
    .update({
      published_at: new Date().toISOString(),
      status: 'published',
    })
    .eq('slug', slug)
    .select()
    .single();

  if (productError) {
    return { success: false, error: productError.message };
  }

  return { success: true, data: product as AdminProductRow };
}

export async function unpublishAdminProduct(slug: string): Promise<AdminProductResult> {
  const client = createServerSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: product, error: productError } = await client
    .from('products')
    .update({
      published_at: null,
      status: 'draft',
    })
    .eq('slug', slug)
    .select()
    .single();

  if (productError) {
    return { success: false, error: productError.message };
  }

  return { success: true, data: product as AdminProductRow };
}

export async function deleteAdminProduct(slug: string): Promise<AdminProductResult> {
  const client = createServerSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  const authCheck = await checkAdminRole();
  if (!authCheck.isAdmin) {
    return { success: false, error: authCheck.error || 'Not authorized' };
  }

  const { data: product, error: productError } = await client
    .from('products')
    .select('id')
    .eq('slug', slug)
    .single();

  if (productError) {
    return { success: false, error: productError.message };
  }

  const found = product as { id: string };

  const { error: deleteError } = await client
    .from('products')
    .delete()
    .eq('slug', slug);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  return { success: true, data: { id: found.id, slug } };
}
