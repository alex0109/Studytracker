"use server";

import z from "zod";
import { createClientOnServer } from "../api/server";
import { validatedAction } from "./middleware.supabase";

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
