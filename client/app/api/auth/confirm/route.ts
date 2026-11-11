import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClientOnServer } from "@/entities/auth/api/server";
import { getSafeRedirect } from "@/shared/lib/safe-redirect";

const EMAIL_TYPES: EmailOtpType[] = ["email", "signup", "magiclink"];

// The button in the sign in email. The token itself is checked here, so the link works in any
// browser, not only the one that asked for it. A used or expired link goes back to sign in
export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const redirectTo = getSafeRedirect(url.searchParams.get("redirect"));

  if (tokenHash && type && EMAIL_TYPES.includes(type)) {
    const supabase = await createClientOnServer();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

    if (!error) return NextResponse.redirect(`${url.origin}${redirectTo}`);
  }

  const signIn = new URL("/sign-in", url.origin);
  signIn.searchParams.set("error", "link");
  if (redirectTo !== "/") signIn.searchParams.set("redirect", redirectTo);
  return NextResponse.redirect(signIn);
}
