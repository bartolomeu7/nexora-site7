import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getAllProjects } from "@/lib/data/projects";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProjectDetailClient } from "./project-detail-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  
  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: `${project.name} | NEXORA GROUP`,
      description: project.description,
      type: "website",
      images: project.gallery.length > 0 ? [project.gallery[0]] : [],
    },
  };
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ProjectDetailClient project={project} />
      <Footer />
    </div>
  );
}