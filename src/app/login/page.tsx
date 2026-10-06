"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ClerkAuth() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "signin";

  return mode === "signup" ? (
    <SignUp
      path="/login"
      routing="path"
      signInUrl="/login"
      forceRedirectUrl="/"
    />
  ) : (
    <SignIn
      path="/login"
      routing="path"
      signUpUrl="/login?mode=signup"
      forceRedirectUrl="/"
    />
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Suspense fallback={<div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
          <ClerkAuth />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}