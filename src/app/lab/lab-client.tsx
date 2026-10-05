"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ExperimentCard } from "@/components/lab/experiment-card";
import { cn } from "@/lib/utils";

const allStatuses = ["Exploring", "Prototyping", "Validating", "Archived", "Graduated"] as const;
const allCategories = ["AI/ML", "Graphics", "Systems", "Web", "Research", "Tools"] as const;

const statusIcons = {
  "Exploring": "🔍",
  "Prototyping": "🛠",
  "Validating": "✓",
  "Archived": "📦",
  "Graduated": "🚀",
} as const;

interface LabClientProps {
  experiments: Array<{
    slug: string;
    name: string;
    description: string;
    longDescription: string;
    category: string;
    categories: string[];
    status: string;
    technologies: string[];
    thumbnail?: string;
    gallery: string[];
    insights: string[];
    challenges: string[];
    nextSteps: string[];
    startedAt: string;
    updatedAt: string;
    links?: {
      github?: string;
      demo?: string;
      article?: string;
      paper?: string;
    };
    tags: string[];
  }>;
}

export function LabClient({ experiments }: { experiments: LabClientProps["experiments"] }) {
  const [selectedStatus, setSelectedStatus] = React.useState<"All" | string>("All");
  const [selectedCategory, setSelectedCategory] = React.useState<"All" | string>("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredExperiments = experiments.filter((experiment) => {
    const matchesStatus = selectedStatus === "All" || experiment.status === selectedStatus;
    const matchesCategory = selectedCategory === "All" || experiment.category === selectedCategory;
    const matchesSearch = experiment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experiment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experiment.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12 flex-wrap"
      >
        <div className="flex flex-wrap items-center gap-2">
          {(["All", ...["Exploring", "Prototyping", "Validating", "Archived", "Graduated"] as const]).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                selectedStatus === status
                  ? "bg-primary text-primary-foreground shadow-glow-subtle"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <span>{status === "All" ? "🔍" : (({ "Exploring": "🔍", "Prototyping": "🛠", "Validating": "✓", "Archived": "📦", "Graduated": "🚀" } as const)[status as keyof typeof statusIcons] || "🔍")}</span>
              {status}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["All", ...["AI/ML", "Graphics", "Systems", "Web", "Research", "Tools"] as const]).map((category) => (
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
      </motion.div>

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
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted_foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiments.length > 0 ? (
            filteredExperiments.map((experiment, index) => (
              <motion.article
                key={experiment.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ExperimentCard experiment={experiment} />
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
      </motion.div>
    </>
  );
}