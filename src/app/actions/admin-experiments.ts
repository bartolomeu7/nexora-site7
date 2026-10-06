"use server";

import { revalidatePath } from "next/cache";
import {
  getAdminExperiments,
  getAdminExperiment,
  createAdminExperiment,
  updateAdminExperiment,
  publishAdminExperiment,
  unpublishAdminExperiment,
  deleteAdminExperiment,
  type AdminExperimentInput,
} from "@/lib/data/admin-experiments";

export async function fetchAdminExperiments() {
  const result = await getAdminExperiments();
  return result;
}

export async function fetchAdminExperiment(slug: string) {
  const result = await getAdminExperiment(slug);
  return result;
}

export async function createExperimentAction(input: AdminExperimentInput) {
  const result = await createAdminExperiment(input);
  if (result.success) {
    revalidatePath("/admin/experiments");
    revalidatePath("/lab");
    revalidatePath("/");
  }
  return result;
}

export async function updateExperimentAction(slug: string, input: Partial<AdminExperimentInput>) {
  const result = await updateAdminExperiment(slug, input);
  if (result.success) {
    revalidatePath("/admin/experiments");
    revalidatePath("/lab");
    revalidatePath("/");
  }
  return result;
}

export async function publishExperimentAction(slug: string) {
  const result = await publishAdminExperiment(slug);
  if (result.success) {
    revalidatePath("/admin/experiments");
    revalidatePath("/lab");
    revalidatePath("/");
  }
  return result;
}

export async function unpublishExperimentAction(slug: string) {
  const result = await unpublishAdminExperiment(slug);
  if (result.success) {
    revalidatePath("/admin/experiments");
    revalidatePath("/lab");
    revalidatePath("/");
  }
  return result;
}

export async function deleteExperimentAction(slug: string) {
  const result = await deleteAdminExperiment(slug);
  if (result.success) {
    revalidatePath("/admin/experiments");
    revalidatePath("/lab");
    revalidatePath("/");
  }
  return result;
}