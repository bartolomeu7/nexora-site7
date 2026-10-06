"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FolderKanban, Package, FlaskConical, FolderTree } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Stat {
  name: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

const stats: Stat[] = [
  { name: "Projects", value: 3, icon: FolderKanban, color: "text-blue-400", trend: "+1 this month", trendUp: true },
  { name: "Products", value: 4, icon: Package, color: "text-emerald-400", trend: "+2 this month", trendUp: true },
  { name: "Experiments", value: 6, icon: FlaskConical, color: "text-purple-400", trend: "+1 this month", trendUp: true },
  { name: "Categories", value: 16, icon: FolderTree, color: "text-amber-400", trend: "No change", trendUp: false },
];

export function AdminStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", stat.color + "/10")}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} aria-hidden="true" />
                </div>
              </div>
              {stat.trend && (
                <p className={cn("text-xs mt-2", stat.trendUp ? "text-emerald-400" : "text-muted-foreground")}>
                  {stat.trend}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}