"use server";

import { revalidatePath } from "next/cache";
import {
  getAdminProjects,
  getAdminProject,
  createAdminProject,
  updateAdminProject,
  publishAdminProject,
  unpublishAdminProject,
  deleteAdminProject,
  type AdminProjectInput,
} from "@/lib/data/admin-projects";

export async function fetchAdminProjects() {
  const result = await getAdminProjects();
  return result;
}

export async function fetchAdminProject(slug: string) {
  const result = await getAdminProject(slug);
  return result;
}

export async function createProjectAction(input: AdminProjectInput) {
  const result = await createAdminProject(input);
  if (result.success) {
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
  }
  return result;
}

export async function updateProjectAction(slug: string, input: Partial<AdminProjectInput>) {
  const result = await updateAdminProject(slug, input);
  if (result.success) {
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
  }
  return result;
}

export async function publishProjectAction(slug: string) {
  const result = await publishAdminProject(slug);
  if (result.success) {
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
  }
  return result;
}

export async function unpublishProjectAction(slug: string) {
  const result = await unpublishAdminProject(slug);
  if (result.success) {
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
  }
  return result;
}

export async function deleteProjectAction(slug: string) {
  const result = await deleteAdminProject(slug);
  if (result.success) {
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
  }
  return result;
}