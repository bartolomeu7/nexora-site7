import { createServerClient } from '@/lib/supabase/server';
import type { Product, ProductStatus, ProductCategory, ChangelogEntry, FAQEntry } from './products';

export type ProductWithRelations = Product & {
    categories: string[];
    technologies: string[];
    compatibility: string[];
    features: string[];
    includes: string[];
    requirements: string[];
    changelog: ChangelogEntry[];
    faq: FAQEntry[];
    thumbnail?: string;
};

// Supabase response types
interface ProductCategoryRow {
    categories: {
        name: string;
        slug: string;
    } | null;
}

interface ProductTechnologyRow {
    technology: string;
}

interface ProductCompatibilityRow {
    platform: string;
}

interface ProductFeatureRow {
    feature: string;
}

interface ProductIncludeRow {
    include_item: string;
}

interface ProductRequirementRow {
    requirement: string;
}

interface ProductChangelogRow {
    version: string;
    date: string;
    changes: string[];
}

interface ProductFAQRow {
    question: string;
    answer: string;
}

interface ProductRow {
    slug: string;
    title: string;
    short_description: string | null;
    description: string | null;
    long_description: string | null;
    status: ProductStatus;
    price: number | string;
    original_price: number | string | null;
    currency: 'USD' | 'EUR' | 'BRL';
    version: string | null;
    last_updated: string | null;
    thumbnail_url: string | null;
    hero_image_url: string | null;
    repository_url: string | null;
    demo_url: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    product_categories: ProductCategoryRow[];
    product_technologies: ProductTechnologyRow[];
    product_compatibility: ProductCompatibilityRow[];
    product_features: ProductFeatureRow[];
    product_includes: ProductIncludeRow[];
    product_requirements: ProductRequirementRow[];
    product_changelog: ProductChangelogRow[];
    product_faq: ProductFAQRow[];
}

interface ProductCategoryRow {
    categories: {
        name: string;
        slug: string;
    } | null;
}

interface ProductTechnologyRow {
    technology: string;
}

interface ProductCompatibilityRow {
    platform: string;
}

interface ProductFeatureRow {
    feature: string;
}

interface ProductIncludeRow {
    include_item: string;
}

interface ProductRequirementRow {
    requirement: string;
}

interface ProductChangelogRow {
    version: string;
    date: string;
    changes: string[];
}

interface ProductFAQRow {
    question: string;
    answer: string;
}

function toISODate(dateStr: string | null): string {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    try {
        return new Date(dateStr).toISOString().split('T')[0];
    } catch {
        return new Date().toISOString().split('T')[0];
    }
}

export async function getAllProductsSupabase(): Promise<ProductWithRelations[]> {
    const client = createServerClient();
    if (!client) {
        console.warn('Supabase not configured, falling back to mock data');
        const { getAllProducts } = await import('./products');
        return getAllProducts().map(p => ({
            ...p,
            categories: [p.category],
            technologies: p.technologies,
            compatibility: p.compatibility,
            features: p.features,
            includes: p.includes,
            requirements: p.requirements,
            changelog: p.changelog,
            faq: p.faq
        }));
    }

    const { data: products, error } = await client
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
        console.error('Error fetching products:', error);
        throw error;
    }

    return (products as ProductRow[]).map(p => ({
        slug: p.slug,
        name: p.title,
        description: p.short_description || '',
        longDescription: p.long_description || p.description || '',
        category: (p.product_categories?.[0]?.categories?.name as ProductCategory) || 'Templates',
        categories: (p.product_categories?.map((pc: ProductCategoryRow) => pc.categories?.name).filter((n): n is string => Boolean(n)) || []) as string[],
        status: p.status,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        currency: p.currency,
        technologies: p.product_technologies?.map((t: ProductTechnologyRow) => t.technology) || [],
        compatibility: p.product_compatibility?.map((c: ProductCompatibilityRow) => c.platform) || [],
        version: p.version || '1.0.0',
        lastUpdated: toISODate(p.last_updated),
        thumbnail: p.thumbnail_url ?? undefined,
        gallery: p.hero_image_url ? [p.hero_image_url] : [],
        features: p.product_features?.map((f: ProductFeatureRow) => f.feature) || [],
        includes: p.product_includes?.map((i: ProductIncludeRow) => i.include_item) || [],
        requirements: p.product_requirements?.map((r: ProductRequirementRow) => r.requirement) || [],
        changelog: p.product_changelog?.map((c: ProductChangelogRow) => ({
            version: c.version,
            date: toISODate(c.date),
            changes: c.changes
        })) || [],
        faq: p.product_faq?.map((f: ProductFAQRow) => ({
            question: f.question,
            answer: f.answer
        })) || [],
        cta: {
            label: (p.status as string) === 'published' ? `Purchase - ${p.currency === 'USD' ? '$' : p.currency === 'EUR' ? '€' : 'R$'}${Number(p.price).toLocaleString()}` : 'Notify Me',
            href: (p.status as string) === 'published' ? `/checkout?product=${p.slug}` : `/contact?interest=${p.slug}`
        }
    }));
}

export async function getProductSupabase(slug: string) {
    const client = createServerClient();
    if (!client) {
        const { getProduct } = await import('./products');
        return getProduct(slug);
    }

    const { data: product, error } = await client
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
        if (error.code === 'PGRST116') return null;
        throw error;
    }

    if (!product) return null;

    const p = product as ProductRow;

    return {
        slug: p.slug,
        name: p.title,
        description: p.short_description || '',
        longDescription: p.long_description || p.description || '',
        category: (p.product_categories?.[0]?.categories?.name as ProductCategory) || 'Templates',
        categories: p.product_categories?.map((pc: ProductCategoryRow) => pc.categories?.name).filter(Boolean) || [],
        status: p.status,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        currency: p.currency,
        technologies: p.product_technologies?.map((t: ProductTechnologyRow) => t.technology) || [],
        compatibility: p.product_compatibility?.map((c: ProductCompatibilityRow) => c.platform) || [],
        version: p.version || '1.0.0',
        lastUpdated: toISODate(p.last_updated),
        thumbnail: p.thumbnail_url ?? undefined,
        gallery: p.hero_image_url ? [p.hero_image_url] : [],
        features: p.product_features?.map((f: ProductFeatureRow) => f.feature) || [],
        includes: p.product_includes?.map((i: ProductIncludeRow) => i.include_item) || [],
        requirements: p.product_requirements?.map((r: ProductRequirementRow) => r.requirement) || [],
        changelog: p.product_changelog?.map((c: ProductChangelogRow) => ({
            version: c.version,
            date: toISODate(c.date),
            changes: c.changes
        })) || [],
        faq: p.product_faq?.map((f: ProductFAQRow) => ({
            question: f.question,
            answer: f.answer
        })) || [],
        cta: {
            label: (p.status as string) === 'published' ? `Purchase - ${p.currency === 'USD' ? '$' : p.currency === 'EUR' ? '€' : 'R$'}${Number(p.price).toLocaleString()}` : 'Notify Me',
            href: (p.status as string) === 'published' ? `/checkout?product=${p.slug}` : `/contact?interest=${p.slug}`
        }
    };
}

export async function getProductsByStatusSupabase(status: string) {
    const client = createServerClient();
    if (!client) {
        const { getProductsByStatus } = await import('./products');
        return getProductsByStatus(status as ProductStatus);
    }

    const { data, error } = await client
        .from('products')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getProductsByCategorySupabase(category: string) {
    const client = createServerClient();
    if (!client) {
        const { getProductsByCategory } = await import('./products');
        return getProductsByCategory(category as ProductCategory);
    }

    const { data, error } = await client
        .from('products')
        .select(`
            *,
            product_categories!inner (
                category_id
            )
        `)
        .eq('product_categories.category_id', (async () => {
            const client2 = createServerClient();
            if (!client2) return '';
            const { data } = await client2.from('categories').select('id').eq('slug', category).single();
            return data?.id || '';
        })())
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}