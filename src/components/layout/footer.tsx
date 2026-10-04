import Link from "next/link";
import { GitBranch, Send, Users, Mail, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const footerLinks = {
  product: [
    { name: "Projects", href: "/projects" },
    { name: "Products", href: "/products" },
    { name: "Lab", href: "/lab" },
    { name: "Changelog", href: "/changelog" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/docs/api" },
    { name: "Community", href: "/community" },
    { name: "Status", href: "/status" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Security", href: "/security" },
    { name: "Cookies", href: "/cookies" },
  ],
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com/nexora-group", icon: GitBranch },
  { name: "Twitter", href: "https://twitter.com/nexora_group", icon: Send },
  { name: "LinkedIn", href: "https://linkedin.com/company/nexora-group", icon: Users },
  { name: "Email", href: "mailto:hello@nexora.group", icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-xl" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground" aria-label="NEXORA GROUP Home">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-2">
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
              </span>
              <span>NEXORA GROUP</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Building what comes next. Software, products, and technological experiences.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground",
                    "transition-all duration-200 hover:border-primary/50 hover:text-primary hover:bg-primary/5",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Product links">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company links">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources links">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal links">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NEXORA GROUP. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Built with</span>
            <span className="flex items-center gap-1.5 text-primary">
              <span className="relative flex h-3 w-3">
                <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                <span className="absolute inset-0 rounded-full bg-primary" />
              </span>
              Next.js
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-chart-2">Tailwind</span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-chart-3">Supabase</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </div>
        </div>
      </div>
    </footer>
  );
}