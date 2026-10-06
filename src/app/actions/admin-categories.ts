"use server";

import { revalidatePath } from "next/cache";
import {
  getAdminCategories,
  getAdminCategory,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  type AdminCategoryInput,
} from "@/lib/data/admin-categories";

export async function fetchAdminCategories() {
  const result = await getAdminCategories();
  return result;
}

export async function fetchAdminCategory(slug: string) {
  const result = await getAdminCategory(slug);
  return result;
}

export async function createCategoryAction(input: AdminCategoryInput) {
  const result = await createAdminCategory(input);
  if (result.success) {
    revalidatePath("/admin/categories");
    revalidatePath("/");
  }
  return result;
}

export async function updateCategoryAction(slug: string, input: Partial<AdminCategoryInput>) {
  const result = await updateAdminCategory(slug, input);
  if (result.success) {
    revalidatePath("/admin/categories");
    revalidatePath("/");
  }
  return result;
}

export async function deleteCategoryAction(slug: string) {
  const result = await deleteAdminCategory(slug);
  if (result.success) {
    revalidatePath("/admin/categories");
    revalidatePath("/");
  }
  return result;
}