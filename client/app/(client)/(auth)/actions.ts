"use server";

import { validatedAction } from "@/shared/api/supabase/middleware.supabase";
import { createClientOnServer } from "@/shared/api/supabase";
import { redirect } from "next/navigation";
import z from "zod";

export type MagicLinkStateType =
  | { error: string; success?: undefined }
  | { success: string; error?: undefined }
  | { error?: undefined; success?: undefined };

export const signInWithMagicLink = validatedAction(
  z.object({
    email: z.string().email(),
    redirect: z.string().optional(),
    priceId: z.string().optional(),
  }),
  async (data) => {
    const supabase = await createClientOnServer();
    const { email } = data;
    const redirectTo = `${process.env.NEXT_PUBLIC_HOME}/api/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${redirectTo}?redirect=${encodeURIComponent(
          "/materials",
        )}`,
      },
    });
    if (error) {
      console.error("Error sending magic link:", error);
      return { error: error.message };
    }

    return { success: "Magic link sent to your email." };
  },
);

export const signOut = async () => {
  const supabase = await createClientOnServer();
  await supabase.auth.signOut();
  redirect("/sign-in");
};
