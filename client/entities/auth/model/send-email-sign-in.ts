"use server";

import z from "zod";
import { createClientOnServer } from "../api/server";
import { getSafeRedirect } from "@/shared/lib/safe-redirect";

export type EmailSignInResult = { ok: true } | { ok: false; error: "invalid" | "rate" | "failed" };

const input = z.object({
  email: z.string().trim().email(),
  redirect: z.string().optional(),
});

// One email with both a code and a button. The button opens /api/auth/confirm, which signs in
// in whatever browser opens it; the code works when the email is read on another device.
// Unknown addresses get an account, so signing in and signing up are the same step
export const sendEmailSignIn = async (data: z.infer<typeof input>): Promise<EmailSignInResult> => {
  const parsed = input.safeParse(data);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const supabase = await createClientOnServer();
  const confirmUrl = `${process.env.NEXT_PUBLIC_HOME}/api/auth/confirm`;

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${confirmUrl}?redirect=${encodeURIComponent(getSafeRedirect(parsed.data.redirect))}`,
    },
  });

  if (!error) return { ok: true };

  console.error("Sign in email was not sent:", error.message);
  return { ok: false, error: error.status === 429 ? "rate" : "failed" };
};
