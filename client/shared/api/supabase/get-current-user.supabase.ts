"use server";

import { User } from "@supabase/supabase-js";
import { createClientOnServer } from "./index";

export const getUser = async (): Promise<{
  user: User | null;
  token: string | undefined;
}> => {
  const supabase = await createClientOnServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token && !user) {
    return { user: null, token: undefined };
  }

  return { user: user, token: session?.access_token };
};
