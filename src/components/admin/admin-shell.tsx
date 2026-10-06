"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  FlaskConical,
  FolderTree,
  Image,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/auth-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Experiments", href: "/admin/experiments", icon: FlaskConical },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Media", href: "/admin/media", icon: Image },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface UserMetadata {
  role?: "admin" | "user" | string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
}

/**
 * UX-ONLY role hint.
 *
 * `user_metadata` is client-visible and NOT authoritative for authorization.
 * Real authorization happens server-side (Server Actions validate the
 * `profiles.role` row) with RLS as the final barrier. This helper only
 * decides whether to render the admin chrome or the "restricted" state.
 */
function hasAdminRoleHint(user: { user_metadata?: UserMetadata }): boolean {
  if (!user?.user_metadata?.role) return false;
  return user.user_metadata.role === "admin";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Derived directly from auth state — no effect needed (fixes setState-in-effect).
  const hasAdminAccess = user ? hasAdminRoleHint(user) : false;
  const loadingRole = authLoading;

  if (loadingRole) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <span className="text-lg">Loading admin role...</span>
        </div>
      </div>
    );
  }

  const adminContent = hasAdminAccess ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  ) : (
    <div className="pt-16 text-center">
      <div className="rounded-xl bg-border/50 p-8 mb-6 max-w-md mx-auto">
        <svg
          className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-medium mb-2">Acesso Restrito</h3>
        <p className="text-muted-foreground">Você não tem permissão para acessar o painel administrativo.</p>
        <Button onClick={() => void signOut()} variant="outline">
          Ir para o Painel
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 lg:w-72 p-0 lg:hidden max-h-screen">
          <SidebarNavigation onNavigate={() => setSidebarOpen(false)} onCloseSidebar={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      <aside className="hidden lg:flex lg:w-72 flex-col bg-card border-r border-border">
        {adminContent}
      </aside>

      <main className="flex-1 overflow-auto lg:overflow-y-auto">
        <div className="p-6 lg:p-8">
          {adminContent}
        </div>
      </main>
    </div>
  );
}

function SidebarNavigation({ onNavigate, onCloseSidebar }: { onNavigate?: () => void; onCloseSidebar?: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-bold text-lg"
          onClick={onNavigate}
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-2">
            <svg
              className="h-5 w-5 text-primary-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span>NEXORA GROUP</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              isActive(item.href)
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
                <AvatarImage
                  src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "user"}`}
                  alt={user?.user_metadata?.full_name || user?.email || "User"}
                />
                <AvatarFallback className="text-xs font-medium">
                  {user?.user_metadata?.full_name
                    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
                    : user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium truncate">{user?.user_metadata?.full_name || user?.email || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-medium">
              {user?.user_metadata?.full_name || user?.email || "Account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/admin/settings" className="flex items-center gap-2" onClick={onCloseSidebar}>
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void signOut()} className="flex items-center gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}