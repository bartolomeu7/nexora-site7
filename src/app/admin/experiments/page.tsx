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
import Link from "next/link";
import {
  fetchAdminExperiments,
  publishExperimentAction,
  unpublishExperimentAction,
  deleteExperimentAction,
} from "@/app/actions/admin-experiments";
import type {
  AdminExperimentRow,
  AdminExperimentTechnologyRow,
  AdminExperimentInsightRow,
  AdminExperimentChallengeRow,
  AdminExperimentNextStepRow,
  AdminExperimentTagRow,
} from "@/lib/data/admin-experiments";

interface Experiment {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  status: string;
  technologies: string[];
  thumbnail: string;
  insights: string[];
  challenges: string[];
  nextSteps: string[];
  tags: string[];
  startedAt: string;
  links?: {
    github?: string;
    demo?: string;
    article?: string;
    paper?: string;
  };
}

const statusColors: Record<string, string> = {
  validating: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  graduated: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  draft: "bg-muted-foreground/20 text-muted-foreground border-border",
  prototyping: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const statusOptions = ["All", "validating", "graduated", "draft", "prototyping"] as const;
const categoryOptions = ["All", "Research", "AI/ML", "Web", "Mobile", "DevOps", "Security"] as const;

function mapRowToExperiment(e: AdminExperimentRow): Experiment {
  return {
    slug: e.slug,
    name: e.title,
    description: e.description || "",
    longDescription: e.long_description || e.description || "",
    category: e.experiment_categories?.[0]?.categories?.name || "Research",
    status: e.status,
    technologies: e.experiment_technologies?.map((t: AdminExperimentTechnologyRow) => t.technology) || [],
    thumbnail: e.thumbnail_url || "",
    insights: e.experiment_insights?.map((i: AdminExperimentInsightRow) => i.insight) || [],
    challenges: e.experiment_challenges?.map((c: AdminExperimentChallengeRow) => c.challenge) || [],
    nextSteps: e.experiment_next_steps?.map((s: AdminExperimentNextStepRow) => s.step) || [],
    tags: e.experiment_tags?.map((t: AdminExperimentTagRow) => t.tag) || [],
    startedAt: e.started_at || "",
    links: {
      github: e.github_url || undefined,
      demo: e.demo_url || undefined,
      article: e.article_url || undefined,
      paper: e.paper_url || undefined,
    },
  };
}

function ExperimentGrid({
  filteredExperiments,
  onView,
  onTogglePublish,
  onDelete,
}: {
  filteredExperiments: Experiment[];
  onView: () => void;
  onTogglePublish: (e: Experiment) => void;
  onDelete: (slug: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredExperiments.length > 0 ? (
        filteredExperiments.map((experiment, index) => (
          <motion.article
            key={experiment.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <AdminExperimentCard
              experiment={experiment}
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
              <h3 className="text-lg font-medium">No experiments found</h3>
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
  filteredExperiments,
  onTogglePublish,
  onDelete,
}: {
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  filteredExperiments: Experiment[];
  onTogglePublish: (e: Experiment) => void;
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
          <h1 className="text-3xl font-bold tracking-tight">Experiments</h1>
          <p className="text-muted-foreground mt-1">Manage your experiments</p>
        </div>
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
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            aria-label="Search experiments"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <ExperimentGrid
          filteredExperiments={filteredExperiments}
          onView={() => {}}
          onTogglePublish={onTogglePublish}
          onDelete={onDelete}
        />
      </motion.div>
    </motion.div>
  );
}

function AdminExperimentCard({
  experiment,
  onView,
  onTogglePublish,
  onDelete,
}: {
  experiment: Experiment;
  onView: () => void;
  onTogglePublish: (e: Experiment) => void;
  onDelete: (slug: string) => void;
}) {
  const isPublished = experiment.status === "validating" || experiment.status === "graduated";
  return (
    <Card className="glass h-full transition-all hover:border-primary/30 hover:shadow-glow-subtle">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <Badge variant="outline" className={statusColors[experiment.status] || statusColors.draft}>
                {experiment.status}
              </Badge>
              <Badge variant="secondary" className="ml-2">{experiment.category}</Badge>
            </div>
          </div>
          <Link href={`/lab`} className="group">
            <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors mb-1">{experiment.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{experiment.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {experiment.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs bg-background/50">
                {tech}
              </Badge>
            ))}
            {experiment.technologies.length > 4 && (
              <Badge variant="outline" className="text-xs bg-background/50 text-muted-foreground">
                +{experiment.technologies.length - 4}
              </Badge>
            )}
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4 border-t border-border">
            <Button variant="outline" size="sm" onClick={onView}>
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onTogglePublish(experiment)}>
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(experiment.slug)}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminExperimentsPage() {
  const [selectedStatus, setSelectedStatus] = React.useState<"All" | string>("All");
  const [selectedCategory, setSelectedCategory] = React.useState<"All" | string>("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [experiments, setExperiments] = React.useState<Experiment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refreshExperiments = React.useCallback(async () => {
    const refreshResult = await fetchAdminExperiments();
    if (refreshResult.error) {
      setError(refreshResult.error);
      return;
    }
    setExperiments((refreshResult.data ?? []).map(mapRowToExperiment));
  }, []);

  React.useEffect(() => {
    async function loadExperiments() {
      try {
        const result = await fetchAdminExperiments();
        if (result.error) {
          setError(result.error);
        } else {
          setExperiments((result.data ?? []).map(mapRowToExperiment));
        }
      } catch {
        setError("Failed to load experiments");
      } finally {
        setLoading(false);
      }
    }
    void loadExperiments();
  }, []);

  const filteredExperiments = experiments.filter((experiment) => {
    const matchesStatus = selectedStatus === "All" || experiment.status === selectedStatus;
    const matchesCategory = selectedCategory === "All" || experiment.category === selectedCategory;
    const matchesSearch = experiment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experiment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experiment.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleTogglePublish = async (experiment: Experiment) => {
    const published = experiment.status === "validating" || experiment.status === "graduated";
    const result = published
      ? await unpublishExperimentAction(experiment.slug)
      : await publishExperimentAction(experiment.slug);
    if (result.success) {
      await refreshExperiments();
    } else {
      setError(result.error || "Failed to update publish state");
    }
  };

  const handleDelete = async (slug: string) => {
    const result = await deleteExperimentAction(slug);
    if (result.success) {
      await refreshExperiments();
    } else {
      setError(result.error || "Failed to delete experiment");
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
            filteredExperiments={filteredExperiments}
            onTogglePublish={(e) => void handleTogglePublish(e)}
            onDelete={(slug) => void handleDelete(slug)}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
