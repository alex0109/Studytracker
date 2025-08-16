"use server";

import { validatedAction } from "@/shared/lib/auth/middleware";
import { createClient } from "@/shared/supabase/server";
import { redirect } from "next/navigation";
import z from "zod";

export type MagicLinkState =
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
    console.log("DATA wewew: ", data);
    console.log("Email from data:", data.email);
    const supabase = await createClient();
    const { email } = data;
    const redirectTo = `${process.env.NEXT_PUBLIC_API_HTTP}/api/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${redirectTo}?redirect=${encodeURIComponent(
          "/materials"
        )}`,
      },
    });
    if (error) {
      console.error("Error sending magic link:", error);
      return { error: error.message };
    }

    return { success: "Magic link sent to your email." };
  }
);

// export const signInWithGoogle = async (
//   event: React.FormEvent<HTMLFormElement>
// ) => {
//   event.preventDefault();
//   const supabase = await createClient();

//   try {
//     const redirectTo = `${process.env.NEXT_PUBLIC_API_HTTP}/api/auth/callback`;
//     const { error: signInError } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: `${redirectTo}?redirect=/test`,
//       },
//     });
//     if (signInError) {
//       return { error: "Failed to sign in with Google. Please try again." };
//     }
//   } catch (error) {
//     return { error: "Failed to sign in with Google. Please try again." };
//   }
// };

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
};
