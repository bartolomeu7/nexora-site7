"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DashboardClient } from "./dashboard-client";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { session, loading, user, isConfigured } = useAuth();

  React.useEffect(() => {
    if (!loading && isConfigured && !session) {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [session, loading, router, isConfigured]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Supabase Not Configured</h1>
            <p className="text-muted-foreground mb-8">
              Please set up your Supabase credentials in the environment variables to use the dashboard.
            </p>
            <p className="text-sm text-muted-foreground">
              Create a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <DashboardClient user={user!} />
      <Footer />
    </div>
  );
}