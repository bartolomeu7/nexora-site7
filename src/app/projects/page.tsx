import { getAllProjectsSupabase } from '@/lib/data/supabase-projects';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProjectsClient } from './projects-client';

export default async function ProjectsPage() {
  const projects = await getAllProjectsSupabase();

  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                Our Work
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Projects
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore the platforms, tools, and infrastructure we&apos;re building. Each project represents
                our commitment to solving real problems for developers and teams.
              </p>
            </div>

            <ProjectsClient projects={projects} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}