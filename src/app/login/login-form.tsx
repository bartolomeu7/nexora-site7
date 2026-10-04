"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

type AuthMode = "signin" | "signup";
type FormStatus = "idle" | "loading" | "success" | "error";

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp } = useAuth();

  const mode = (searchParams.get("mode") as AuthMode) || "signin";
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [formStatus, setFormStatus] = React.useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const signInForm = useForm<SignInData>({
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpData>({
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const handleSignIn = async (data: SignInData) => {
    setFormStatus("loading");
    setErrorMessage("");
    const { error } = await signIn(data.email, data.password);
    if (error) {
      setFormStatus("error");
      setErrorMessage(error.message);
    } else {
      setFormStatus("success");
      setTimeout(() => router.push(callbackUrl), 500);
    }
  };

  const handleSignUp = async (data: SignUpData) => {
    if (data.password !== data.confirmPassword) {
      setFormStatus("error");
      setErrorMessage("Passwords do not match");
      return;
    }
    if (data.password.length < 8) {
      setFormStatus("error");
      setErrorMessage("Password must be at least 8 characters");
      return;
    }
    setFormStatus("loading");
    setErrorMessage("");
    const { error } = await signUp(data.email, data.password);
    if (error) {
      setFormStatus("error");
      setErrorMessage(error.message);
    } else {
      setFormStatus("success");
      setTimeout(() => router.push(callbackUrl), 500);
    }
  };

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
        <p className="text-muted-foreground">
          {mode === "signin" ? "Sign in to your account" : "Create your account"}
        </p>
      </motion.div>

      <Card className="glass-strong">
        <CardHeader>
          <Tabs value={mode} onValueChange={(v) => router.push(`/login?mode=${v}&callbackUrl=${callbackUrl}`)} className="w-full">
            <TabsList className="w-full bg-secondary/50">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="pt-4">
          {mode === "signin" ? (
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-6" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    {...signInForm.register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    disabled={formStatus === "loading"}
                    aria-invalid={signInForm.formState.errors.email ? "true" : "false"}
                  />
                </div>
                {signInForm.formState.errors.email && (
                  <p className="text-sm text-destructive" role="alert">
                    {signInForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...signInForm.register("password", { required: "Password is required" })}
                    disabled={formStatus === "loading"}
                    aria-invalid={signInForm.formState.errors.password ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {signInForm.formState.errors.password && (
                  <p className="text-sm text-destructive" role="alert">
                    {signInForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {formStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {formStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm"
                  role="status"
                >
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>Signing in...</span>
                </motion.div>
              )}

              <Button type="submit" className="w-full" size="lg" variant="premium" disabled={formStatus === "loading"}>
                {formStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Forgot your password?{" "}
                <a href="/reset-password" className="underline hover:text-primary">Reset it</a>
              </div>
            </form>
          ) : (
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-6" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    {...signUpForm.register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    disabled={formStatus === "loading"}
                    aria-invalid={signUpForm.formState.errors.email ? "true" : "false"}
                  />
                </div>
                {signUpForm.formState.errors.email && (
                  <p className="text-sm text-destructive" role="alert">
                    {signUpForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...signUpForm.register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "Password must be at least 8 characters" },
                    })}
                    disabled={formStatus === "loading"}
                    aria-invalid={signUpForm.formState.errors.password ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {signUpForm.formState.errors.password && (
                  <p className="text-sm text-destructive" role="alert">
                    {signUpForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...signUpForm.register("confirmPassword", { required: "Please confirm your password" })}
                    disabled={formStatus === "loading"}
                    aria-invalid={signUpForm.formState.errors.confirmPassword ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {signUpForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive" role="alert">
                    {signUpForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {formStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {formStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm"
                  role="status"
                >
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>Creating account...</span>
                </motion.div>
              )}

              <Button type="submit" className="w-full" size="lg" variant="premium" disabled={formStatus === "loading"}>
                {formStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          )}

          <Separator className="my-6" />

          <p className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <a
              href={`/login?mode=${mode === "signin" ? "signup" : "signin"}&callbackUrl=${callbackUrl}`}
              className="font-medium text-primary hover:underline"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </a>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-primary">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}