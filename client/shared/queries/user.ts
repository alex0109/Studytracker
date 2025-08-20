"use server";

import { createClient } from "../supabase/server";

export const getUser = async () => {
  const supabase = await createClient();
  // console.log("SUPABASE: \n", supabase);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // console.log("ERROR: \n", error);
  // console.log("USER: \n", await supabase.auth.getUser());

  if (error) {
    return null;
  }

  return user;
};
