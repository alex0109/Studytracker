import { getUser } from "@/entities/auth";
import { createClientOnServer } from "@/entities/auth/api/server";
import { NextResponse } from "next/server";

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
