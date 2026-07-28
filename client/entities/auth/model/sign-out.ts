"use server";

import { redirect } from "next/navigation";
import { createClientOnServer } from "../api/server";
import { toast } from "@/shared/radix-ui";

export const signOut = async () => {
  const supabase = await createClientOnServer();
  await supabase.auth.signOut();
  toast({
    title: "✅Successfully signed out",
    variant: "success",
  });
  redirect("/sign-in");
};
