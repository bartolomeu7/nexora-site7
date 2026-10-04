"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, Tag, Star } from "lucide-react";
import { getProductStatusColor, type Product } from "@/lib/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const statusColor = getProductStatusColor(product.status);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <Card className="relative overflow-hidden group h-full transition-all duration-300 hover:border-primary/30 hover:shadow-glow-subtle">
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-2/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Tag className="h-16 w-16 text-primary/20" aria-hidden="true" />
        </div>
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="outline" className={cn("bg-background/80 backdrop-blur", statusColor)}>
            {product.status}
          </Badge>
          <Badge variant="secondary" className="bg-background/80 backdrop-blur">
            {product.category}
          </Badge>
        </div>
        {hasDiscount && (
          <div className="absolute top-4 right-4">
            <Badge variant="destructive" className="bg-destructive/90 text-destructive-foreground">
              -{Math.round((1 - product.price / (product.originalPrice || product.price)) * 100)}%
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <Link href={`/products/${product.slug}`} className="group">
          <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {product.technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs bg-background/50">
              {tech}
            </Badge>
          ))}
          {product.technologies.length > 3 && (
            <Badge variant="outline" className="text-xs bg-background/50 text-muted-foreground">
              +{product.technologies.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-sm line-through text-muted-foreground">
                {product.currency === "USD" ? "$" : product.currency === "EUR" ? "€" : "R$"}{product.originalPrice}
              </span>
            )}
            <span className="text-2xl font-bold text-foreground">
              {product.currency === "USD" ? "$" : product.currency === "EUR" ? "€" : "R$"}{product.price}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.9</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button variant="ghost" size="sm" asChild className="group">
            <Link href={`/products/${product.slug}`}>
              View Details
              <ExternalLink className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            size="sm"
            variant={product.status === "Available" ? "premium" : "outline"}
            disabled={product.status !== "Available"}
            asChild
          >
            <Link href={product.cta.href}>
              {product.cta.label}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}