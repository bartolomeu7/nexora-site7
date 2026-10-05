import { getAllProductsSupabase } from '@/lib/data/supabase-products';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProductsClient } from './products-client';

export default async function ProductsPage() {
  const products = await getAllProductsSupabase();

  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                Digital Products
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Products
              </h1>
              <p className="text-lg text-muted-foreground">
                Premium templates, UI kits, boilerplates, and components. Built with modern stacks,
                battle-tested in production, and designed for developers who value quality.
              </p>
            </div>

            <ProductsClient products={products} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}