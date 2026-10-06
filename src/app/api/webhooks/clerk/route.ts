import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface ClerkEmailAddress {
  email_address: string;
}

interface ClerkWebhookUser {
  id: string;
  email_addresses?: ClerkEmailAddress[];
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
  public_metadata?: {
    role?: string;
    [key: string]: unknown;
  };
}

export async function POST(req: NextRequest) {
  let evt: { type: string; data: ClerkWebhookUser };

  try {
    const raw = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET!,
    });
    evt = {
      type: raw.type,
      data: raw.data as unknown as ClerkWebhookUser,
    };
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const eventType = evt.type;
  const client = createServerSupabaseClient();

  if (!client) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const user = evt.data;
  const email = user.email_addresses?.[0]?.email_address ?? null;
  const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || null;
  const avatarUrl = user.image_url ?? null;
  const role = user.public_metadata?.role === "admin" ? "admin" : "user";
  const now = new Date().toISOString();

  if (eventType === "user.created") {
    const { error } = await client
      .from("profiles")
      .upsert(
        {
          clerk_user_id: user.id,
          email,
          display_name: fullName,
          avatar_url: avatarUrl,
          role,
          created_at: now,
          updated_at: now,
        },
        { onConflict: "clerk_user_id" }
      );

    if (error) {
      console.error("Error creating profile:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Profile created" });
  }

  if (eventType === "user.updated") {
    const { error } = await client
      .from("profiles")
      .update({
        email,
        display_name: fullName,
        avatar_url: avatarUrl,
        updated_at: now,
      })
      .eq("clerk_user_id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Profile updated" });
  }

  if (eventType === "user.deleted") {
    const { error } = await client
      .from("profiles")
      .update({
        deleted_at: now,
        role: "user",
      })
      .eq("clerk_user_id", user.id);

    if (error) {
      console.error("Error soft deleting profile:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Profile marked as deleted" });
  }

  return NextResponse.json({ success: true, message: "Event processed" });
}
