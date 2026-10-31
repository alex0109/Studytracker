"use client";

import { useState } from "react";
import { useSession } from "@/shared/context/session.provider";
import { createClient } from "@/entities/auth/api/client";
import { logExceptionError } from "@/shared/lib/exeption.sentry";

// Back on the account page with the delete dialog open, signed in a moment ago
const RETURN_PATH = "/account?delete=1";

// The same way the user signed in: Google goes through its page again, email gets a fresh magic link
export const useReauth = () => {
  const { user } = useSession();
  const [state, setState] = useState<"idle" | "pending" | "sent" | "error">("idle");
  const isGoogle = user?.app_metadata?.provider === "google";

  const reauth = async () => {
    const supabase = createClient();
    const callback = `${process.env.NEXT_PUBLIC_HOME}/api/auth/callback?redirect=${encodeURIComponent(RETURN_PATH)}`;
    setState("pending");

    const { error } = isGoogle
      ? await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback } })
      : await supabase.auth.signInWithOtp({
          email: user?.email ?? "",
          options: { emailRedirectTo: callback, shouldCreateUser: false },
        });

    if (error) {
      logExceptionError(error, { section: "account/reauth", userID: user?.id });
      setState("error");
      return;
    }

    // Google leaves the page by itself
    if (!isGoogle) setState("sent");
  };

  return { reauth, reauthState: state, isGoogle };
};
