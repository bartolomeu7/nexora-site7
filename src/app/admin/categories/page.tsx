"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  fetchAdminCategories,
  deleteCategoryAction,
} from "@/app/actions/admin-categories";
import type { AdminCategoryRow } from "@/lib/data/admin-categories";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

const typeOptions = ["All", "project", "product", "experiment", "general"] as const;

function mapRowToCategory(c: AdminCategoryRow): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    type: c.type || "general",
    createdAt: c.created_at || "",
    updatedAt: c.updated_at || "",
  };
}

function CategoryGrid({
  filteredCategories,
  onView,
  onDelete,
}: {
  filteredCategories: Category[];
  onView: () => void;
  onDelete: (slug: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCategories.length > 0 ? (
        filteredCategories.map((category, index) => (
          <motion.article
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <AdminCategoryCard category={category} onView={onView} onDelete={onDelete} />
          </motion.article>
        ))
      ) : (
        <div className="col-span-full text-center py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex flex-col items-center gap-4"
          >
            <svg className="h-12 w-12 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-medium">No categories found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function HeaderSection({
  selectedType,
  setSelectedType,
  searchQuery,
  setSearchQuery,
  filteredCategories,
  onDelete,
}: {
  selectedType: string;
  setSelectedType: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  filteredCategories: Category[];
  onDelete: (slug: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage your categories</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex flex-wrap items-center gap-2">
          {typeOptions.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                selectedType === type
                  ? "bg-primary text-primary-foreground shadow-glow-subtle"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative"
      >
        <div className="relative max-w-xl mx-auto mb-8">
          <input
            type="search"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            aria-label="Search categories"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <CategoryGrid filteredCategories={filteredCategories} onView={() => {}} onDelete={onDelete} />
      </motion.div>
    </motion.div>
  );
}

function AdminCategoryCard({
  category,
  onView,
  onDelete,
}: {
  category: Category;
  onView: () => void;
  onDelete: (slug: string) => void;
}) {
  return (
    <Card className="glass h-full transition-all hover:border-primary/30 hover:shadow-glow-subtle">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <Badge variant="secondary" className="ml-2">{category.type}</Badge>
            </div>
          </div>
          <h3 className="text-xl font-bold tracking-tight mb-1">{category.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{category.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            <Badge variant="outline" className="text-xs bg-background/50">
              /{category.slug}
            </Badge>
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4 border-t border-border">
            <Button variant="outline" size="sm" onClick={onView}>
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(category.slug)}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminCategoriesPage() {
  const [selectedType, setSelectedType] = React.useState<"All" | string>("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refreshCategories = React.useCallback(async () => {
    const refreshResult = await fetchAdminCategories();
    if (refreshResult.error) {
      setError(refreshResult.error);
      return;
    }
    setCategories((refreshResult.data ?? []).map(mapRowToCategory));
  }, []);

  React.useEffect(() => {
    async function loadCategories() {
      try {
        const result = await fetchAdminCategories();
        if (result.error) {
          setError(result.error);
        } else {
          setCategories((result.data ?? []).map(mapRowToCategory));
        }
      } catch {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    }
    void loadCategories();
  }, []);

  const filteredCategories = categories.filter((category) => {
    const matchesType = selectedType === "All" || category.type === selectedType;
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDelete = async (slug: string) => {
    const result = await deleteCategoryAction(slug);
    if (result.success) {
      await refreshCategories();
    } else {
      setError(result.error || "Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16">
        <Navbar />
        <main className="flex-1">
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <main className="flex-1">
        <div className="p-6 lg:p-8">
          {error && (
            <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/30 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          <HeaderSection
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredCategories={filteredCategories}
            onDelete={(slug) => void handleDelete(slug)}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
