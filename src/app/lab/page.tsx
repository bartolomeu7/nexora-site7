import { getAllExperimentsSupabase } from '@/lib/data/supabase-experiments';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { LabClient } from './lab-client';
import { motion } from 'framer-motion';

export default async function LabPage() {
  const experiments = await getAllExperimentsSupabase();

  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                NEXORA LAB
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Lab
              </h1>
              <p className="text-lg text-muted-foreground">
                Experiments, ideas, and technologies we&apos;re exploring. Not all of these will become products,
                but each teaches us something valuable about the future of software.
              </p>
            </motion.div>

            <LabClient experiments={experiments} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}