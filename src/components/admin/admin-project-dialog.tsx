"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface Project {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  status: string;
  technologies: string[];
  thumbnail: string;
  gallery: string[];
  features: string[];
  timeline: Array<{
    date: string;
    title: string;
    description: string;
    type: "milestone" | "release" | "update" | "planning";
  }>;
  cta: {
    label: string;
    href: string;
  };
  startedAt: string;
  updatedAt: string;
  links?: {
    github?: string;
    demo?: string;
    docs?: string;
  };
}

interface AdminProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
  editingProject: Project | null;
}

export function AdminProjectDialog({ open, onClose, onSubmit, editingProject }: AdminProjectDialogProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      if (key === "technologies") {
        data[key] = (value as string).split(",").map((s) => s.trim()).filter(Boolean);
      } else {
        data[key] = value;
      }
    });
    onSubmit(data);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editingProject ? "Edit Project" : "New Project"}</SheetTitle>
          <SheetDescription>
            {editingProject ? "Update project details" : "Create a new project"}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Project name" required defaultValue={editingProject?.name || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="project-slug" required defaultValue={editingProject?.slug || ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {["Platform", "Infrastructure", "Developer Tools", "Applications"].map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {["development", "active", "experimental", "coming_soon", "archived"].map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea id="description" name="description" placeholder="Brief description" rows={3} defaultValue={editingProject?.description || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea id="longDescription" name="longDescription" placeholder="Detailed description" rows={6} defaultValue={editingProject?.longDescription || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma separated)</Label>
            <Input id="technologies" name="technologies" placeholder="Next.js, TypeScript, PostgreSQL..." defaultValue={editingProject?.technologies?.join(", ") || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repository_url">Repository URL</Label>
            <Input id="repository_url" name="repository_url" placeholder="https://github.com/..." type="url" defaultValue={editingProject?.links?.github || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo_url">Demo URL</Label>
            <Input id="demo_url" name="demo_url" placeholder="https://demo.example.com" type="url" defaultValue={editingProject?.links?.demo || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="docs_url">Documentation URL</Label>
            <Input id="docs_url" name="docs_url" placeholder="https://docs.example.com" type="url" defaultValue={editingProject?.links?.docs || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startedAt">Started At</Label>
            <Input id="startedAt" name="startedAt" type="date" defaultValue={editingProject?.startedAt || ""} />
          </div>
          <SheetFooter className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{editingProject ? "Update" : "Create"}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}