"use server";

import { createClient } from "../supabase/server";

export const getUsers = async (): Promise<any> => {
  const supabase = await createClient();

  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  return { data: users };
};
