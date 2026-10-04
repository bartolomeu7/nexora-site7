import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getAllProducts, type Product } from "@/lib/data/products";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductDetailClient } from "./product-detail-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  
  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | NEXORA GROUP`,
      description: product.description,
      type: "website",
      images: product.gallery.length > 0 ? [product.gallery[0]] : [],
    },
  };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ProductDetailClient product={product} />
      <Footer />
    </div>
  );
}