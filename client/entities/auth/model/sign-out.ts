"use server";

import { redirect } from "next/navigation";
import { createClientOnServer } from "../api/server";

export const signOut = async () => {
  const supabase = await createClientOnServer();
  await supabase.auth.signOut();
  redirect("/sign-in");
};
