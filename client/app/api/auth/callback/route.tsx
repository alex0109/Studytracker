import { createClientOnServer } from "@/shared/api/supabase";
import { NextResponse } from "next/server";
import { getUser } from "@/shared/api/supabase/get-current-user.supabase";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const encodedRedirectTo = requestUrl.searchParams.get("redirect") || "/";

  const redirectTo = decodeURIComponent(encodedRedirectTo);

  const supabase = await createClientOnServer();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    const { user } = await getUser();
  }

  return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);
}
