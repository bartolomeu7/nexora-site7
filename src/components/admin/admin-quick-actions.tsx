"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FolderKanban, Package, FlaskConical, FolderTree, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

const quickActions = [
  { name: "New Project", href: "/admin/projects/new", icon: FolderKanban, color: "bg-blue-500/10 text-blue-400", description: "Create a new project" },
  { name: "New Product", href: "/admin/products/new", icon: Package, color: "bg-emerald-500/10 text-emerald-400", description: "Add a new product" },
  { name: "New Experiment", href: "/admin/experiments/new", icon: FlaskConical, color: "bg-purple-500/10 text-purple-400", description: "Start a new experiment" },
  { name: "New Category", href: "/admin/categories/new", icon: FolderTree, color: "bg-amber-500/10 text-amber-400", description: "Create a new category" },
  { name: "View All Projects", href: "/admin/projects", icon: ExternalLink, color: "bg-muted-foreground/10 text-muted-foreground", description: "Browse all projects" },
  { name: "View All Products", href: "/admin/products", icon: ExternalLink, color: "bg-muted-foreground/10 text-muted-foreground", description: "Browse all products" },
];

export function AdminQuickActions() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={action.href}
                className={cn(
                  "group flex flex-col items-center gap-3 p-6 rounded-xl glass border border-border",
                  "transition-all duration-200 hover:border-primary/30 hover:shadow-glow-subtle"
                )}
              >
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", action.color)}>
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-sm">{action.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}