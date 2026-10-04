"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { projects, getProjectStatusColor, type Project } from "@/lib/data/projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusIcons = {
  "In Development": Loader2,
  "Active": CheckCircle,
  "Experimental": AlertCircle,
  "Coming Soon": Clock,
};

export function BuildingNow() {
  const buildingNowProjects = projects.filter((p) =>
    ["In Development", "Active", "Experimental"].includes(p.status)
  );

  return (
    <section id="building-now" className="py-20 lg:py-28 bg-gradient-to-b from-background to-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
              <span className="absolute inset-0 rounded-full bg-primary" />
            </span>
            Building Now
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Currently in Development
          </h2>
          <p className="text-lg text-muted-foreground">
            Active projects shaping the future of developer tools, infrastructure, and AI-native workflows.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildingNowProjects.map((project, index) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProjectCard project={project} featured />
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button variant="outline" size="lg" asChild>
            <a href="/projects">
              View All Projects
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  const StatusIcon = statusIcons[project.status] || Clock;
  const statusColor = getProjectStatusColor(project.status);

  return (
    <Card className={cn(
      "relative overflow-hidden group h-full transition-all duration-300",
      "hover:border-primary/30 hover:shadow-glow-subtle",
      featured && "border-primary/20"
    )}>
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-chart-2/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <StatusIcon className="h-16 w-16 text-primary/20" aria-hidden="true" />
        </div>
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="outline" className={cn("bg-background/80 backdrop-blur", statusColor)}>
            {project.status}
          </Badge>
          <Badge variant="secondary" className="bg-background/80 backdrop-blur">
            {project.category}
          </Badge>
        </div>
        <div className="absolute bottom-4 right-4">
          <Badge variant="outline" className="bg-background/80 backdrop-blur flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            {project.technologies.length} techs
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
          </div>
          {featured && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              ⚡
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
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

        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="group">
            <a href={project.cta.href}>
              {project.cta.label}
              <ExternalLink className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="View on GitHub"
            >
              <GitBranch className="h-5 w-5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}