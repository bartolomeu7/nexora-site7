"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Eye, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AdminProjectDialog } from "@/components/admin/admin-project-dialog";
import Link from "next/link";
import {
  fetchAdminProjects,
  createProjectAction,
  updateProjectAction,
  publishProjectAction,
  unpublishProjectAction,
  deleteProjectAction,
} from "@/app/actions/admin-projects";
import type {
  AdminProjectRow,
  AdminProjectTechnologyRow,
  AdminProjectFeatureRow,
  AdminProjectTimelineRow,
  AdminProjectInput,
} from "@/lib/data/admin-projects";
import type { ProjectStatus } from "@/lib/data/projects";

interface Project {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  status: string;
  technologies: string[];
  thumbnail: string;
  gallery: string[];
  features: string[];
  timeline: Array<{
    date: string;
    title: string;
    description: string;
    type: "milestone" | "release" | "update" | "planning";
  }>;
  cta: {
    label: string;
    href: string;
  };
  startedAt: string;
  updatedAt: string;
  links?: {
    github?: string;
    demo?: string;
    docs?: string;
  };
}

const statusColors: Record<string, string> = {
  development: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  experimental: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  coming_soon: "bg-muted-foreground/20 text-muted-foreground border-border",
  archived: "bg-muted-foreground/20 text-muted-foreground border-border",
  draft: "bg-muted-foreground/20 text-muted-foreground border-border",
};

const statusOptions = ["All", "development", "active", "experimental", "coming_soon", "archived"] as const;
const categoryOptions = ["All", "Platform", "Infrastructure", "Developer Tools", "Applications"] as const;

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function parseProjectStatus(value: unknown): ProjectStatus {
  if (value === "Active" || value === "active") return "Active";
  if (value === "Experimental" || value === "experimental") return "Experimental";
  if (value === "Coming Soon" || value === "coming_soon") return "Coming Soon";
  return "In Development";
}

function mapRowToProject(p: AdminProjectRow): Project {
  return {
    slug: p.slug,
    name: p.title,
    description: p.short_description || "",
    longDescription: p.long_description || p.description || "",
    category: p.project_categories?.[0]?.categories?.name || "Platform",
    status: p.status,
    technologies: p.project_technologies?.map((t: AdminProjectTechnologyRow) => t.technology) || [],
    thumbnail: p.thumbnail_url || "",
    gallery: p.hero_image_url ? [p.hero_image_url] : [],
    features: p.project_features?.map((f: AdminProjectFeatureRow) => f.feature) || [],
    timeline: p.project_timeline_events?.map((t: AdminProjectTimelineRow) => ({
      date: t.date,
      title: t.title,
      description: t.description || "",
      type: t.type,
    })) || [],
    cta: {
      label: p.repository_url ? "View on GitHub" : "Learn More",
      href: p.repository_url || p.docs_url || "/contact",
    },
    startedAt: p.started_at || "",
    updatedAt: p.updated_at || "",
    links: {
      github: p.repository_url || undefined,
      demo: p.demo_url || undefined,
      docs: p.docs_url || undefined,
    },
  };
}

function ProjectGrid({
  filteredProjects,
  onEdit,
  onView,
  onTogglePublish,
  onDelete,
}: {
  filteredProjects: Project[];
  onEdit: (p: Project) => void;
  onView: () => void;
  onTogglePublish: (p: Project) => void;
  onDelete: (slug: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.length > 0 ? (
        filteredProjects.map((project, index) => (
          <motion.article
            key={project.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <AdminProjectCard
              project={project}
              onEdit={onEdit}
              onView={onView}
              onTogglePublish={onTogglePublish}
              onDelete={onDelete}
            />
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
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function HeaderSection({
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  setDialogOpen,
  filteredProjects,
  setEditingProject,
  onTogglePublish,
  onDelete,
}: {
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  setDialogOpen: (open: boolean) => void;
  filteredProjects: Project[];
  setEditingProject: (p: Project) => void;
  onTogglePublish: (p: Project) => void;
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
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your projects</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex flex-wrap items-center gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                selectedStatus === status
                  ? "bg-primary text-primary-foreground shadow-glow-subtle"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {categoryOptions.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border border-border",
                selectedCategory === category
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:border-primary/30"
              )}
            >
              {category}
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
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            aria-label="Search projects"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <ProjectGrid
          filteredProjects={filteredProjects}
          onEdit={setEditingProject}
          onView={() => {}}
          onTogglePublish={onTogglePublish}
          onDelete={onDelete}
        />
      </motion.div>
    </motion.div>
  );
}

function AdminProjectCard({
  project,
  onEdit,
  onView,
  onTogglePublish,
  onDelete,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onView: () => void;
  onTogglePublish: (p: Project) => void;
  onDelete: (slug: string) => void;
}) {
  const isPublished = project.status === "active";
  return (
    <Card className="glass h-full transition-all hover:border-primary/30 hover:shadow-glow-subtle">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <Badge variant="outline" className={statusColors[project.status] || statusColors.development}>
                {project.status}
              </Badge>
              <Badge variant="secondary" className="ml-2">{project.category}</Badge>
            </div>
          </div>
          <Link href={`/projects/${project.slug}`} className="group">
            <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors mb-1">{project.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs bg-background/50">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="outline" className="text-xs bg-background/50 text-muted-foreground">
                +{project.technologies.length - 4}
              </Badge>
            )}
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4 border-t border-border">
            <Button variant="ghost" size="sm" onClick={() => onEdit(project)}>
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={onView}>
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onTogglePublish(project)}>
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(project.slug)}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminProjectsPage() {
  const [selectedStatus, setSelectedStatus] = React.useState<"All" | string>("All");
  const [selectedCategory, setSelectedCategory] = React.useState<"All" | string>("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refreshProjects = React.useCallback(async () => {
    const refreshResult = await fetchAdminProjects();
    if (refreshResult.error) {
      setError(refreshResult.error);
      return;
    }
    setProjects((refreshResult.data ?? []).map(mapRowToProject));
  }, []);

  React.useEffect(() => {
    async function loadProjects() {
      try {
        const result = await fetchAdminProjects();
        if (result.error) {
          setError(result.error);
        } else {
          setProjects((result.data ?? []).map(mapRowToProject));
        }
      } catch {
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    void loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus;
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const input: AdminProjectInput = {
        slug: asString(data.slug),
        title: asString(data.name),
        short_description: asString(data.description),
        long_description: asString(data.longDescription),
        status: parseProjectStatus(data.status),
        repository_url: asString(data.repository_url) || undefined,
        demo_url: asString(data.demo_url) || undefined,
        docs_url: asString(data.docs_url) || undefined,
        started_at: asString(data.startedAt) || undefined,
        technologies: asStringArray(data.technologies),
      };

      const result = editingProject
        ? await updateProjectAction(editingProject.slug, input)
        : await createProjectAction(input);

      if (result.success) {
        setDialogOpen(false);
        setEditingProject(null);
        await refreshProjects();
      } else {
        setError(result.error || "Failed to save project");
      }
    } catch {
      setError("Failed to save project");
    }
  };

  const handleTogglePublish = async (project: Project) => {
    const result = project.status === "active"
      ? await unpublishProjectAction(project.slug)
      : await publishProjectAction(project.slug);
    if (result.success) {
      await refreshProjects();
    } else {
      setError(result.error || "Failed to update publish state");
    }
  };

  const handleDelete = async (slug: string) => {
    const result = await deleteProjectAction(slug);
    if (result.success) {
      await refreshProjects();
    } else {
      setError(result.error || "Failed to delete project");
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
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setDialogOpen={setDialogOpen}
            filteredProjects={filteredProjects}
            setEditingProject={setEditingProject}
            onTogglePublish={(p) => void handleTogglePublish(p)}
            onDelete={(slug) => void handleDelete(slug)}
          />
        </div>
      </main>
      <Footer />
      <AdminProjectDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={(d) => void handleSubmit(d)} editingProject={editingProject} />
    </div>
  );
}
