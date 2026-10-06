import { AdminStats } from "@/components/admin/admin-stats";
import { AdminRecentActivity } from "@/components/admin/admin-recent-activity";
import { AdminQuickActions } from "@/components/admin/admin-quick-actions";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function AdminDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Overview of your NEXORA GROUP admin panel
              </p>
            </div>
          </div>

          <AdminStats />
          <AdminRecentActivity />
          <AdminQuickActions />
        </div>
      </main>
      <Footer />
    </div>
  );
}