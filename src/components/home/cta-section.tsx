"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Rocket, Target, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Rocket, value: "3", label: "Active Projects" },
  { icon: Users, value: "12+", label: "Team Members" },
  { icon: Target, value: "100%", label: "Open Source" },
  { icon: BarChart2, value: "∞", label: "Possibilities" },
];

export function CTASection() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 via-transparent to-chart-2/5" aria-hidden="true" />
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-primary/10 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              Ready to build?
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Join Us in Building the Future
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Whether you're a developer, designer, or product thinker — there's a place for you at NEXORA.
              We're always looking for curious minds to collaborate with.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="p-4 rounded-xl glass border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <stat.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button size="lg" variant="premium" asChild>
                <a href="/contact">
                  Start a Conversation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/lab">Explore Lab</a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden glass border border-border"
            >
              <div className="aspect-square relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-2/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-64 w-64 text-primary/5" viewBox="0 0 100 100" aria-hidden="true">
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                </div>
                <div className="relative z-10 p-8">
                  <div className="space-y-4">
                    {[
                      "npm create nexora-app@latest",
                      "cd my-nexora-project",
                      "npm run dev",
                      "🚀 Server ready at localhost:3000",
                    ].map((line, i) => (
                      <motion.div
                        key={line}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.2 }}
                        className="font-mono text-sm text-muted-foreground/80"
                      >
                        <span className="text-primary mr-2">$</span>
                        {line}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 h-32 w-32 md:h-40 md:w-40 rounded-2xl bg-gradient-to-br from-primary to-chart-2 opacity-20 blur-2xl" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}