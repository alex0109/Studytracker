"use server";

import { createClientOnServer } from "../api/server";

export const getUsers = async (): Promise<any> => {
  const supabase = await createClientOnServer();

  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  return { data: users };
};
