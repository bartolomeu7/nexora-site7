"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Clock, CheckCircle, AlertCircle, Loader2, ArrowLeft, Calendar, Tag, GitBranch, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn, formatDate } from "@/lib/utils";
import type { Project } from "@/lib/data/projects";

const statusIcons = {
  "In Development": Loader2,
  "Active": CheckCircle,
  "Experimental": AlertCircle,
  "Coming Soon": Clock,
};

interface ProjectDetailClientProps {
  project: Project;
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const StatusIcon = statusIcons[project.status] || Clock;
  const [activeTab, setActiveTab] = React.useState("overview");
  const [currentImage, setCurrentImage] = React.useState(0);

  return (
    <main className="flex-1">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative min-h-[60vh] lg:min-h-[70vh] flex items-end overflow-hidden"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-background" />
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-12">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge variant="outline" className={cn("text-sm", getProjectStatusColor(project.status))}>
                      <StatusIcon className="h-3 w-3 mr-1.5" />
                      {project.status}
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                      {project.category}
                    </Badge>
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                      >
                        <GitBranch className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                    {project.name}
                  </h1>

                  <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    {project.longDescription}
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Started {formatDate(project.startedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Updated {formatDate(project.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      <span>v{project.timeline.length} milestones</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>{project.technologies.length} technologies</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="sticky top-24"
                >
                  <Card className="glass-strong">
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Features</h3>
                        <ul className="space-y-2">
                          {project.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      <Button className="w-full" variant="premium" size="lg" asChild>
                        <Link href={project.cta.href}>
                          {project.cta.label}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      {project.links && (
                        <div className="flex flex-wrap gap-2">
                          {project.links.docs && (
                            <Button variant="outline" size="sm" asChild className="flex-1">
                              <Link href={project.links.docs} target="_blank" rel="noopener noreferrer">
                                Documentation
                              </Link>
                            </Button>
                          )}
                          {project.links.demo && (
                            <Button variant="outline" size="sm" asChild className="flex-1">
                              <Link href={project.links.demo} target="_blank" rel="noopener noreferrer">
                                Live Demo
                              </Link>
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-secondary/50 rounded-xl p-1 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-in">
            <section>
              <h2 className="text-2xl font-bold mb-4">About This Project</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                <p className="text-lg leading-relaxed mb-4">{project.longDescription}</p>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Key Objectives</h3>
                <ul className="list-disc list-inside space-y-2">
                  {project.features.slice(0, 5).map((feature) => (
                    <li key={feature} className="leading-relaxed">{feature}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="h-10 text-sm justify-center gap-2">
                    <Tag className="h-4 w-4" />
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Links & Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.links?.github && (
                  <Button variant="outline" asChild className="h-12">
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      View on GitHub
                    </a>
                  </Button>
                )}
                {project.links?.docs && (
                  <Button variant="outline" asChild className="h-12">
                    <a href={project.links.docs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Documentation
                    </a>
                  </Button>
                )}
                {project.links?.demo && (
                  <Button variant="outline" asChild className="h-12">
                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="timeline" className="animate-in">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-chart-2" />
              {project.timeline.map((event, index) => (
                <motion.div
                  key={`${event.date}-${event.title}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative pl-12 pb-12 last:pb-0"
                >
                  <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background z-10">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      event.type === "milestone" && "bg-primary",
                      event.type === "release" && "bg-emerald-500",
                      event.type === "update" && "bg-blue-500",
                      event.type === "planning" && "bg-muted-foreground"
                    )} />
                  </div>
                  <div className="bg-card/50 backdrop-blur rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-primary">{event.date}</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {event.type}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="animate-in">
            {project.gallery.length > 0 ? (
              <div className="space-y-8">
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-chart-2/10" />
                  <div className="relative z-10 h-full flex items-center justify-center">
                    <span className="text-muted-foreground/50 text-lg">
                      {project.gallery[currentImage]}
                    </span>
                  </div>
                  {project.gallery.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {project.gallery.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={cn(
                            "h-2 w-2 rounded-full transition-all",
                            index === currentImage
                              ? "bg-primary w-6"
                              : "bg-muted-foreground/50 hover:bg-muted-foreground"
                          )}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.gallery.map((image, index) => (
                    <motion.div
                      key={image}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => setCurrentImage(index)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-chart-2/10" />
                      <div className="relative z-10 h-full flex items-center justify-center">
                        <span className="text-muted-foreground/50 text-sm">{image}</span>
                      </div>
                      {index === currentImage && (
                        <div className="absolute inset-0 border-2 border-primary/50 pointer-events-none" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium mb-1">No gallery images yet</h3>
                <p className="text-muted-foreground">Visual content coming soon.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function getProjectStatusColor(status: Project["status"]): string {
  switch (status) {
    case "In Development":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Active":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Experimental":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Coming Soon":
      return "bg-muted-foreground/20 text-muted-foreground border-border";
    default:
      return "bg-muted-foreground/20 text-muted-foreground border-border";
  }
}