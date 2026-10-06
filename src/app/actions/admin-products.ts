"use server";

import { revalidatePath } from "next/cache";
import {
  getAdminProducts,
  getAdminProduct,
  createAdminProduct,
  updateAdminProduct,
  publishAdminProduct,
  unpublishAdminProduct,
  deleteAdminProduct,
  type AdminProductInput,
} from "@/lib/data/admin-products";

export async function fetchAdminProducts() {
  const result = await getAdminProducts();
  return result;
}

export async function fetchAdminProduct(slug: string) {
  const result = await getAdminProduct(slug);
  return result;
}

export async function createProductAction(input: AdminProductInput) {
  const result = await createAdminProduct(input);
  if (result.success) {
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
  }
  return result;
}

export async function updateProductAction(slug: string, input: Partial<AdminProductInput>) {
  const result = await updateAdminProduct(slug, input);
  if (result.success) {
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
  }
  return result;
}

export async function publishProductAction(slug: string) {
  const result = await publishAdminProduct(slug);
  if (result.success) {
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
  }
  return result;
}

export async function unpublishProductAction(slug: string) {
  const result = await unpublishAdminProduct(slug);
  if (result.success) {
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
  }
  return result;
}

export async function deleteProductAction(slug: string) {
  const result = await deleteAdminProduct(slug);
  if (result.success) {
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
  }
  return result;
}