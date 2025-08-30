"use server";

import { User } from "@supabase/supabase-js";
import { createClient } from "../supabase/server";

export const getUser = async (): Promise<{
  user: User | null;
  token: string | undefined;
}> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("No access token found");
  }

  return { user: user, token: session?.access_token };
};
