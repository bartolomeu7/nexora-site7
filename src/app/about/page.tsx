"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { motion } from "framer-motion";
import { Target, Users, Code2, Shield, Zap, Globe, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const values = [
  {
    icon: Target,
    title: "Purpose-Driven",
    description: "Every line of code serves a clear purpose. We build solutions that solve real problems, not chase trends.",
  },
  {
    icon: Users,
    title: "Developer First",
    description: "We optimize for the people who use our tools. Great developer experience isn't a feature—it's the foundation.",
  },
  {
    icon: Code2,
    title: "Craftsmanship",
    description: "Quality over quantity. We sweat the details because they compound into exceptional products.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Security isn't an afterthought. It's architected from day one, tested continuously, and never compromised.",
  },
  {
    icon: Zap,
    title: "Performance Obsessed",
    description: "Every millisecond counts. We build for speed, efficiency, and scale from the ground up.",
  },
  {
    icon: Globe,
    title: "Open by Default",
    description: "We believe in open source, open standards, and open collaboration. The best solutions are built together.",
  },
];

const stats = [
  { value: "15+", label: "Open Source Projects" },
  { value: "50k+", label: "Developers Reached" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Community Support" },
];

const team = [
  { name: "Bartolomeu", role: "Founder & CEO", bio: "Full-stack engineer turned product builder. Obsessed with developer experience." },
  { name: "Team", role: "Core Engineers", bio: "Distributed team of specialists in systems, frontend, and infrastructure." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <main className="flex-1">
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-chart-2/5" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                About NEXORA GROUP
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Building what comes next.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                NEXORA GROUP is a technology company focused on developing software, digital products,
                and technological experiences that push boundaries. We believe the best tools are built
                by developers, for developers—with craftsmanship, security, and performance at the core.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="text-center p-6 rounded-2xl glass border border-border"
                >
                  <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-gradient-to-b from-background to-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground">
                Principles that guide every decision, every line of code, and every product we ship.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full glass border border-border hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                        <value.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                What We Build
              </h2>
              <p className="text-lg text-muted-foreground">
                From infrastructure to developer tools, our products span the full spectrum of modern software development.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="h-full glass border border-border">
                  <CardContent className="p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                      <Code2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Platforms</h3>
                    <p className="text-muted-foreground mb-6">
                      Unified development platforms that streamline the entire software lifecycle.
                      From idea to production, with intelligence built in.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {["NEXORA WORKS (In Development)", "Future platform initiatives"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" asChild>
                      <a href="/projects?category=Platform">Explore Platforms →</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="h-full glass border border-border">
                  <CardContent className="p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2 mb-6">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Infrastructure</h3>
                    <p className="text-muted-foreground mb-6">
                      Tools for managing distributed systems at scale. Service mesh, configuration,
                      governance, and observability—built for production.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {["MGS (Active)", "Local-First Sync (Experiment)"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" asChild>
                      <a href="/projects?category=Infrastructure">Explore Infrastructure →</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="h-full glass border border-border">
                  <CardContent className="p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-6">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Developer Tools</h3>
                    <p className="text-muted-foreground mb-6">
                      AI-native development agents, code intelligence, and productivity tools
                      that amplify what developers can achieve.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {["STEVE (Experimental)", "Code Intelligence Graph (Research)"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" asChild>
                      <a href="/projects?category=Developer Tools">Explore Tools →</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-gradient-to-b from-background to-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                The Team
              </h2>
              <p className="text-lg text-muted-foreground">
                A distributed team of engineers, designers, and builders united by a passion
                for creating exceptional developer tools.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass border border-border h-full">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-chart-2 text-primary-foreground font-bold text-2xl shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                          <p className="text-primary font-medium mb-4">{member.role}</p>
                          <p className="text-muted-foreground">{member.bio}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Ready to Build Together?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Whether you're looking to collaborate, contribute, or just want to say hello—
                we'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="premium" asChild>
                  <a href="/contact">Get in Touch</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="https://github.com/nexora-group" target="_blank" rel="noopener noreferrer">
                    View on GitHub
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}