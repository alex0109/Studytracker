import { createClient } from "@/shared/supabase/server";
import { NextResponse } from "next/server";
import { getUser } from "@/shared/queries/user";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const encodedRedirectTo = requestUrl.searchParams.get("redirect") || "/";

  // console.log("GET PAGE");
  // console.log("CODE: ", code);

  const redirectTo = decodeURIComponent(encodedRedirectTo);

  const supabase = await createClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    console.log(
      "EXCHANGE: \n",
      await supabase.auth.exchangeCodeForSession(code)
    );
    const userData = await getUser();
    // console.log("USER DATA: ", await userData);
  }

  return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);

  // Successful authentication, redirect to the intended page
  // Ensure we're using the correct origin
}
