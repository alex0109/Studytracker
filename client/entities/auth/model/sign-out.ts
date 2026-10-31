"use server";

import { redirect } from "next/navigation";
import { createClientOnServer } from "../api/server";
import { getSafeRedirect } from "@/shared/lib/safe-redirect";

// After an account deletion the user lands on the home page with a note instead of the sign in form
export const signOut = async (redirectTo?: string) => {
  const supabase = await createClientOnServer();
  await supabase.auth.signOut();
  redirect(redirectTo ? getSafeRedirect(redirectTo) : "/sign-in");
};
