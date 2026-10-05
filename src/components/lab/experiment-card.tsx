"use client";

import * as React from "react";
import { ExternalLink, GitBranch, Tag, Clock } from "lucide-react";
import { getExperimentStatusColor, type ExperimentStatus } from "@/lib/data/experiments";

interface ExperimentCardExperiment {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  status: string;
  technologies: string[];
  startedAt: string;
  updatedAt: string;
  links?: {
    github?: string;
    demo?: string;
    article?: string;
  };
}
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusIcons = {
  "Exploring": "🔍",
  "Prototyping": "🛠",
  "Validating": "✓",
  "Archived": "📦",
  "Graduated": "🚀",
} as const;

interface ExperimentCardProps {
  experiment: ExperimentCardExperiment;
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const statusColor = getExperimentStatusColor(experiment.status as ExperimentStatus);
  const StatusIcon = statusIcons[experiment.status as keyof typeof statusIcons] || "🔍";

  return (
    <Card className="relative overflow-hidden group h-full transition-all duration-300 hover:border-primary/30 hover:shadow-glow-subtle">
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-2/10" />
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {StatusIcon}
        </div>
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="outline" className={cn("bg-background/80 backdrop-blur", statusColor)}>
            <span className="mr-1">{StatusIcon}</span>
            {experiment.status}
          </Badge>
          <Badge variant="secondary" className="bg-background/80 backdrop-blur">
            {experiment.category}
          </Badge>
        </div>
        <div className="absolute bottom-4 right-4">
          <Badge variant="outline" className="bg-background/80 backdrop-blur flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {experiment.technologies.length} techs
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
          {experiment.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{experiment.description}</p>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="flex flex-wrap gap-1.5">
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

        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Started {new Date(experiment.startedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
            <span>Updated {new Date(experiment.updatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {experiment.links?.github && (
              <a
                href={experiment.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <GitBranch className="h-3 w-3" />
                Code
              </a>
            )}
            {experiment.links?.demo && (
              <a
                href={experiment.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Demo
              </a>
            )}
            {experiment.links?.article && (
              <a
                href={experiment.links.article}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <Clock className="h-3 w-3" />
                Article
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}