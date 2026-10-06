"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "project" | "product" | "experiment";
  action: "created" | "updated" | "published" | "drafted";
  title: string;
  timestamp: string;
  status: "published" | "draft" | "beta" | "experimental" | "prototyping";
}

const mockActivities: ActivityItem[] = [
  { id: "1", type: "project", action: "published", title: "NEXORA WORKS", timestamp: "2 hours ago", status: "published" },
  { id: "2", type: "product", action: "updated", title: "NEXORA Dashboard Template v2.1.0", timestamp: "5 hours ago", status: "published" },
  { id: "3", type: "experiment", action: "created", title: "WebGPU Compute Shaders", timestamp: "1 day ago", status: "prototyping" },
  { id: "4", type: "project", action: "updated", title: "MGS v1.2.0", timestamp: "2 days ago", status: "published" },
  { id: "5", type: "product", action: "created", title: "NEXORA Component Library", timestamp: "3 days ago", status: "draft" },
];

const typeIcons = {
  project: "📁",
  product: "📦",
  experiment: "🧪",
};

const statusColors = {
  published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  draft: "bg-muted-foreground/20 text-muted-foreground border-border",
  beta: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  experimental: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  prototyping: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const getTypeColor = (type: "project" | "product" | "experiment") => {
  switch (type) {
    case "project": return "bg-blue-500/10 text-blue-400";
    case "product": return "bg-emerald-500/10 text-emerald-400";
    case "experiment": return "bg-purple-500/10 text-purple-400";
  }
};

export function AdminRecentActivity() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border hover:bg-card transition-colors"
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", getTypeColor(activity.type as "project" | "product" | "experiment"))}>
                <span className="text-2xl">{typeIcons[activity.type as "project" | "product" | "experiment"]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{activity.title}</span>
                  <Badge variant="outline" className={cn("text-xs", statusColors[activity.status as "published" | "draft" | "beta" | "experimental" | "prototyping"])}>
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.action} • {activity.timestamp}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                {activity.type}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}