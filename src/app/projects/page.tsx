"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { motion } from "framer-motion";
import { projects, getAllProjects, type Project, type ProjectStatus, type ProjectCategory } from "@/lib/data/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const allStatuses: ProjectStatus[] = ["In Development", "Active", "Experimental", "Coming Soon"];
const allCategories: ProjectCategory[] = ["Platform", "Infrastructure", "Developer Tools", "Applications"];

export default function ProjectsPage() {
  const [selectedStatus, setSelectedStatus] = React.useState<ProjectStatus | "All">("All");
  const [selectedCategory, setSelectedCategory] = React.useState<ProjectCategory | "All">("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredProjects = getAllProjects().filter((project) => {
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus;
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                Our Work
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Projects
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore the platforms, tools, and infrastructure we're building. Each project represents
                our commitment to solving real problems for developers and teams.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12 flex-wrap"
            >
              <div className="flex flex-wrap items-center gap-2">
                {(["All", ...allStatuses] as (ProjectStatus | "All")[]).map((status) => (
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
                {(["All", ...allCategories] as (ProjectCategory | "All")[]).map((category) => (
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <motion.article
                      key={project.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <ProjectCard project={project} />
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
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}