"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Tag, Star, CheckCircle, ArrowLeft, Calendar, Shield, Download, Code2, Globe, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Product } from "@/lib/data/products";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeTab, setActiveTab] = React.useState("overview");
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <main className="flex-1">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative min-h-[50vh] lg:min-h-[60vh] flex items-end overflow-hidden"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-background" />
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-12">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge variant="outline" className={cn("text-sm", getProductStatusColor(product.status))}>
                      <Tag className="h-3 w-3 mr-1.5" />
                      {product.status}
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                      {product.category}
                    </Badge>
                    <Badge variant="outline" className="text-sm flex items-center gap-1.5">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      4.9 (127 reviews)
                    </Badge>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                    {product.name}
                  </h1>

                  <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    {product.longDescription}
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>v{product.version} · Updated {formatDate(product.lastUpdated)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4" />
                      <span>{product.technologies.length} technologies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{product.compatibility.join(", ")}</span>
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
                    <CardHeader className="pb-3">
                      <div className="flex items-baseline justify-between gap-4">
                        <div>
                          {hasDiscount && (
                            <span className="text-sm line-through text-muted-foreground">
                              {formatCurrency(product.originalPrice || product.price, product.currency)}
                            </span>
                          )}
                          <CardTitle className="text-3xl font-bold">
                            {formatCurrency(product.price, product.currency)}
                          </CardTitle>
                        </div>
                        {hasDiscount && (
                          <Badge variant="destructive" className="ml-2">
                            {Math.round((1 - product.price / (product.originalPrice || product.price)) * 100)}% OFF
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">One-time purchase · Lifetime updates</p>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4">
                      <ul className="space-y-3">
                        {[
                          { icon: Download, label: "Instant download", desc: "ZIP + GitHub access" },
                          { icon: Shield, label: "Lifetime updates", desc: "All future versions included" },
                          { icon: Code2, label: "Full source code", desc: "MIT licensed, no restrictions" },
                          { icon: Globe, label: "Documentation", desc: "Comprehensive guides included" },
                        ].map((item) => (
                          <li key={item.label} className="flex items-start gap-3 text-sm">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                              <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-muted-foreground">{item.desc}</div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <Separator />

                      <Button className="w-full" variant="premium" size="lg" asChild>
                        <Link href={product.cta.href}>
                          {product.cta.label}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      <Button className="w-full" variant="outline" asChild>
                        <Link href={`/products/${product.slug}#faq`}>
                          View FAQ
                        </Link>
                      </Button>
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
          <TabsList className="w-full grid grid-cols-4 bg-secondary/50 rounded-xl p-1 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-in">
            <section>
              <h2 className="text-2xl font-bold mb-4">What&apos;s Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.includes.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-card/50 border border-border"
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.requirements.map((req, index) => (
                  <motion.div
                    key={req}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border"
                  >
                    <Box className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-muted-foreground">{req}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {product.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-sm gap-2">
                    <Code2 className="h-3 w-3" />
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Compatibility</h2>
              <div className="flex flex-wrap gap-2">
                {product.compatibility.map((platform) => (
                  <Badge key={platform} variant="secondary" className="text-sm">
                    {platform}
                  </Badge>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="features" className="animate-in">
            <div className="space-y-4">
              {product.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start gap-4 p-6 rounded-xl bg-card/50 border border-border group hover:border-primary/30 transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature}</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed implementation guide available in documentation.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="changelog" className="animate-in">
            <div className="space-y-4">
              {product.changelog.map((entry) => (
                <Accordion key={entry.version} className="w-full">
                  <AccordionItem value={entry.version}>
                    <AccordionTrigger className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <Tag className="h-5 w-5 text-primary" />
                        <div>
                          <span className="font-semibold">{entry.version}</span>
                          <span className="text-sm text-muted-foreground ml-2">{formatDate(entry.date)}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {entry.changes.map((change) => (
                          <li key={change}>{change}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="animate-in" id="faq">
            <div className="space-y-4">
              {product.faq.map((faq, index) => (
                <Accordion key={index} className="w-full">
                  <AccordionItem value={index.toString()}>
                    <AccordionTrigger className="py-4 text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function getProductStatusColor(status: Product["status"]): string {
  switch (status) {
    case "Available":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Coming Soon":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Beta":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Discontinued":
      return "bg-muted-foreground/20 text-muted-foreground border-border";
    default:
      return "bg-muted-foreground/20 text-muted-foreground border-border";
  }
}