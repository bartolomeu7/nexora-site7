"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  User,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { getAllProjects, type Project } from "@/lib/data/projects";
import { getAllProducts, type Product } from "@/lib/data/products";
import Link from "next/link";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard?tab=projects", icon: FolderKanban },
  { name: "Products", href: "/dashboard?tab=products", icon: Package },
  { name: "Profile", href: "/dashboard?tab=profile", icon: User },
  { name: "Settings", href: "/dashboard?tab=settings", icon: Settings },
];

interface DashboardClientProps {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
}

export function DashboardClient({ user }: DashboardClientProps) {
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("overview");

  const allProjects = getAllProjects();
  const allProducts = getAllProducts();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-20 left-4 z-50">
            <LayoutDashboard className="h-6 w-6" />
          </Button>
        </SheetTrigger>
<SheetContent side="left" className="w-64 lg:w-72 p-0 lg:hidden">
            <SidebarNavigation user={user} onNavigate={() => setSidebarOpen(false)} setActiveTab={setActiveTab} activeTab={activeTab} signOut={signOut} />
          </SheetContent>
      </Sheet>

      <aside className="hidden lg:flex lg:w-72 flex-col bg-card border-r border-border">
        <SidebarNavigation user={user} setActiveTab={setActiveTab} activeTab={activeTab} signOut={signOut} />
      </aside>

      <main className="flex-1 overflow-auto lg:overflow-y-auto">
        <div className="p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === "overview" && <OverviewTab user={user} projects={allProjects} products={allProducts} />}
            {activeTab === "projects" && <ProjectsTab projects={allProjects} setActiveTab={setActiveTab} />}
            {activeTab === "products" && <ProductsTab products={allProducts} setActiveTab={setActiveTab} />}
            {activeTab === "profile" && <ProfileTab user={user} />}
            {activeTab === "settings" && <SettingsTab />}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function SidebarNavigation({
  user,
  onNavigate,
  setActiveTab,
  activeTab,
  signOut,
}: {
  user: DashboardClientProps["user"];
  onNavigate?: () => void;
  setActiveTab?: (tab: string) => void;
  activeTab?: string;
  signOut: () => Promise<void>;
}) {
  const handleNavClick = (tab: string) => {
    setActiveTab?.(tab);
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Link
          href="/dashboard"
          onClick={() => handleNavClick("overview")}
          className="flex items-center gap-2 font-bold text-lg"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-2">
            <svg className="h-5 w-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span>NEXORA GROUP</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Dashboard navigation">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => handleNavClick(item.name.toLowerCase())}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              activeTab === item.name.toLowerCase() || (activeTab === "overview" && item.name === "Overview")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || "user"}`} alt={user.name || "User"} />
                <AvatarFallback className="text-sm font-medium">
                  {user.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium truncate">{user.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-medium">{user.name || user.email || "Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavClick("profile")} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavClick("settings")} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function OverviewTab({ user, projects, products }: { user: DashboardClientProps["user"]; projects: Project[]; products: Product[] }) {
  const stats = [
    { name: "Projects", value: projects.length, icon: FolderKanban, color: "text-blue-400" },
    { name: "Products", value: products.length, icon: Package, color: "text-emerald-400" },
    { name: "Active Projects", value: projects.filter((p) => p.status === "Active" || p.status === "In Development").length, icon: LayoutDashboard, color: "text-primary" },
    { name: "Available Products", value: products.filter((p) => p.status === "Available").length, icon: CheckCircle, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name?.split(" ")[0] || "there"}</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your projects and products.</p>
        </div>
        <Button variant="premium" size="sm" asChild>
          <Link href="/projects">Explore Projects</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", stat.color + "/10")}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <div key={project.slug} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Link href={`/projects/${project.slug}`} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.status}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" asChild className="h-20 flex flex-col items-center gap-2">
                <Link href="/projects">
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">New Project</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-20 flex flex-col items-center gap-2">
                <Link href="/products">
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">New Product</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-20 flex flex-col items-center gap-2">
                <Link href="/lab">
                  <Search className="h-6 w-6" />
                  <span className="text-sm">Explore Lab</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-20 flex flex-col items-center gap-2">
                <Link href="/contact">
                  <Filter className="h-6 w-6" />
                  <span className="text-sm">Contact Us</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProjectsTab({ projects, setActiveTab }: { projects: Project[]; setActiveTab?: (tab: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button variant="premium" asChild onClick={() => setActiveTab?.("overview")}>
          <Link href="/projects">View All</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.slug} className="glass">
            <CardContent className="p-6">
              <Link href={`/projects/${project.slug}`} className="flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">{tech}</span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">{project.status}</span>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProductsTab({ products, setActiveTab }: { products: Product[]; setActiveTab?: (tab: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button variant="premium" asChild onClick={() => setActiveTab?.("overview")}>
          <Link href="/products">View All</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.slug} className="glass">
            <CardContent className="p-6">
              <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">${product.price}</span>
                  <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">{product.status}</span>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProfileTab({ user }: { user: DashboardClientProps["user"] }) {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card className="glass">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || "user"}`} alt={user.name || "User"} />
              <AvatarFallback className="text-2xl font-bold">
                {user.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : user.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.name || "User"}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-mono text-sm">{user.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member since</p>
              <p className="font-mono text-sm">2024</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card className="glass">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Always use dark theme</p>
            </div>
            <Button variant="outline" size="sm">Enabled</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-muted-foreground">Email notifications for updates</p>
            </div>
            <Button variant="outline" size="sm">On</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="glass">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">Change Password</Button>
          <Button variant="destructive" className="w-full">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}