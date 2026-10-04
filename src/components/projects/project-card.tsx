"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
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

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
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
            <Link href={`/projects/${project.slug}`} className="group">
              <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                {project.name}
              </h3>
            </Link>
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
            <Link href={`/projects/${project.slug}`}>
              View Details
              <ExternalLink className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={`View ${project.name} on GitHub`}
            >
              <GitBranch className="h-5 w-5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}