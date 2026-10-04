"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, MessageSquare, MapPin, GitBranch, Send, Users, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";

const subjects = [
  { value: "general", label: "General Inquiry" },
  { value: "partnership", label: "Partnership & Business" },
  { value: "support", label: "Technical Support" },
  { value: "careers", label: "Careers" },
  { value: "press", label: "Press & Media" },
  { value: "other", label: "Other" },
];

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formStatus, setFormStatus] = React.useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setFormStatus("loading");
    setErrorMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormStatus("success");
      reset();
    } catch {
      setFormStatus("error");
      setErrorMessage("Failed to send message. Please try again or email us directly.");
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <ToastProvider>
        <main className="flex-1">
          <section className="relative py-20 lg:py-28 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-chart-2/5" aria-hidden="true" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                    Get in Touch
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                    Let us start a conversation.
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-10">
                    Whether you have a question about our projects, want to explore a partnership,
                    or just want to say hello—we'd love to hear from you.
                  </p>

                  <div className="space-y-6">
                    {[
                      { icon: Mail, title: "Email", value: "hello@nexora.group", href: "mailto:hello@nexora.group" },
                      { icon: GitBranch, title: "GitHub", value: "github.com/nexora-group", href: "https://github.com/nexora-group" },
                      { icon: Send, title: "Twitter", value: "@nexora_group", href: "https://twitter.com/nexora_group" },
                      { icon: Users, title: "LinkedIn", value: "NEXORA GROUP", href: "https://linkedin.com/company/nexora-group" },
                    ].map((contact) => (
                      <motion.a
                        key={contact.title}
                        href={contact.href}
                        target={contact.href.startsWith("http") ? "_blank" : undefined}
                        rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-4 p-4 rounded-xl glass border border-border hover:border-primary/30 transition-colors group"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                          <contact.icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{contact.title}</div>
                          <div className="font-medium text-foreground group-hover:text-primary transition-colors">{contact.value}</div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card className="glass-strong">
                    <CardHeader>
                      <CardTitle>Send us a message</CardTitle>
                      <CardDescription>We'll get back to you within 24 hours.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              placeholder="Your name"
                              {...register("name", {
                                required: "Name is required",
                                minLength: { value: 2, message: "Name must be at least 2 characters" },
                              })}
                              disabled={isSubmitting}
                              aria-invalid={errors.name ? "true" : "false"}
                              aria-describedby={errors.name ? "name-error" : undefined}
                            />
                            {errors.name && (
                              <p id="name-error" className="text-sm text-destructive" role="alert">
                                {errors.name.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              {...register("email", {
                                required: "Email is required",
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "Invalid email address",
                                },
                              })}
                              disabled={isSubmitting}
                              aria-invalid={errors.email ? "true" : "false"}
                              aria-describedby={errors.email ? "email-error" : undefined}
                            />
                            {errors.email && (
                              <p id="email-error" className="text-sm text-destructive" role="alert">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <Select
                            onValueChange={(value) => {}}
                            defaultValue="general"
                          >
                            <SelectTrigger
                              id="subject"
                              aria-invalid={errors.subject ? "true" : "false"}
                              aria-describedby={errors.subject ? "subject-error" : undefined}
                              disabled={isSubmitting}
                            >
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.value} value={subject.value}>
                                  {subject.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.subject && (
                            <p id="subject-error" className="text-sm text-destructive" role="alert">
                              {errors.subject.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us what's on your mind..."
                            rows={5}
                            {...register("message", {
                              required: "Message is required",
                              minLength: { value: 10, message: "Message must be at least 10 characters" },
                              maxLength: { value: 5000, message: "Message must be less than 5000 characters" },
                            })}
                            disabled={isSubmitting}
                            aria-invalid={errors.message ? "true" : "false"}
                            aria-describedby={errors.message ? "message-error" : undefined}
                          />
                          {errors.message && (
                            <p id="message-error" className="text-sm text-destructive" role="alert">
                              {errors.message.message}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          variant="premium"
                          disabled={isSubmitting || formStatus === "loading"}
                        >
                          {formStatus === "loading" || isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : formStatus === "success" ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Message Sent!
                            </>
                          ) : (
                            <>
                              Send Message
                              <Send className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>

                        {formStatus === "error" && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
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
                            className="flex items-center gap-2 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm"
                            role="status"
                          >
                            <CheckCircle className="h-4 w-4 shrink-0" />
                            <span>Thanks for reaching out! We'll get back to you soon.</span>
                          </motion.div>
                        )}

                        <p className="text-xs text-muted-foreground text-center">
                          By submitting this form, you agree to our{" "}
                          <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>
                          {" "}and{" "}
                          <a href="/terms" className="underline hover:text-primary">Terms of Service</a>
                          .
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>

        <section className="py-20 lg:py-28 bg-gradient-to-b from-background to-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Frequently Asked
              </h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: "How long does it take to get a response?",
                  a: "We typically respond within 24 hours on business days. For urgent inquiries, please mention it in the subject line.",
                },
                {
                  q: "Can I contribute to your open source projects?",
                  a: "Absolutely! Check out our GitHub organization for contribution guidelines. We welcome PRs, issues, and discussions.",
                },
                {
                  q: "Do you offer custom development services?",
                  a: "We're focused on building our own products. For custom work, we recommend our partner agencies or the developers in our community.",
                },
                {
                  q: "What's your tech stack?",
                  a: "Primarily TypeScript, React/Next.js, Go, Rust, PostgreSQL, and cloud-native tools. Each project uses what fits best.",
                },
                {
                  q: "Are you hiring?",
                  a: "We are a small, focused team. When we have openings, we post them on our careers page and Twitter. Feel free to send your portfolio anyway!",
                },
                {
                  q: "Can I use your products commercially?",
                  a: "Yes! All our paid products come with commercial licenses. Open source projects use MIT/Apache 2.0 licenses allowing commercial use.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="glass border border-border">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      </ToastProvider>
      <ToastViewport />
      <Footer />
    </div>
  );
}