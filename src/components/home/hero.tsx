"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Sparkles,
    title: "Innovation First",
    description: "Pioneering new approaches to software development and digital experiences.",
  },
  {
    icon: Zap,
    title: "Performance Obsessed",
    description: "Every millisecond matters. Built for speed, scale, and reliability.",
  },
  {
    icon: Shield,
    title: "Security by Default",
    description: "Enterprise-grade security practices baked into every layer.",
  },
  {
    icon: Code2,
    title: "Developer Experience",
    description: "Tools and platforms that developers actually love to use.",
  },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 -z-10 noise-bg" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-chart-2/5" aria-hidden="true" />
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-chart-2/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-accent/5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
              <span className="absolute inset-0 rounded-full bg-primary" />
            </span>
            Now in Public Beta
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
            <span className="text-foreground">NEXORA</span>{" "}
            <span className="gradient-text">GROUP</span>
          </h1>

          <p className="mb-10 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto text-balance leading-relaxed">
            We develop software, digital products, and technological experiences that push boundaries.
            <br />
            <span className="font-medium text-foreground">Building what comes next.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="xl" variant="premium" asChild>
              <a href="/projects">
                Explore Projects
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </a>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <a href="/products">View Products</a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                <span className="absolute inset-0 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
            <span className="flex items-center gap-1.5">v2024.12</span>
            <span className="flex items-center gap-1.5">TypeScript</span>
            <span className="flex items-center gap-1.5">Open Source</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="group relative p-6 rounded-2xl glass border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        aria-hidden="true"
      >
        <svg className="h-6 w-6 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  );
}