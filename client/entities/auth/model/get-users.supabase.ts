"use server";

import { User } from "@supabase/supabase-js";
import { createClientOnServer } from "../api/server";

export const getUsers = async (): Promise<{ data: User[] }> => {
  const supabase = await createClientOnServer();

  const {
    data: { users },
  } = await supabase.auth.admin.listUsers();

  return { data: users };
};
