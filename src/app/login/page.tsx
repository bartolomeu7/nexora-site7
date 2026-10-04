import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}