"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { isAuthRetryableFetchError, User } from "@supabase/supabase-js";
import { SessionProvider } from "@/shared/context/session.provider";
import { createClient } from "../../api/client";
import { SessionExpiredModal } from "./session-expired-modal";

type RetriedRequest = InternalAxiosRequestConfig & { authRetried?: boolean };

// undefined token: the check itself failed (offline), the session may still be fine
type Renewal = { token?: string; expired: boolean };

const API = process.env.NEXT_PUBLIC_API_HTTP;

// Requests that fail together wait for one renewal instead of each starting its own
let renewing: Promise<Renewal> | null = null;

const renewToken = (stale: string) => {
  renewing ??= (async (): Promise<Renewal> => {
    const supabase = createClient();

    // The browser client renews the token by itself, the failed request may only have carried the old one
    const { data } = await supabase.auth.getSession();
    if (data.session && data.session.access_token !== stale) {
      return { token: data.session.access_token, expired: false };
    }

    const { data: refreshed, error } = await supabase.auth.refreshSession();
    if (refreshed.session) return { token: refreshed.session.access_token, expired: false };
    return { expired: !isAuthRetryableFetchError(error) };
  })().finally(() => {
    renewing = null;
  });

  return renewing;
};

interface AuthSessionProps {
  user: User | null;
  token: string | undefined;
  children: ReactNode;
}

// The server reads the session once per page load, but a tab can stay open for days and the
// token lives an hour. Here it stays fresh: Supabase renews it in the background, a request
// that still met a 401 is renewed and sent again, and a session that can't be renewed (signed
// out elsewhere, refresh token expired) is said out loud instead of requests failing quietly
export const AuthSession = ({ user, token, children }: AuthSessionProps) => {
  const [session, setSession] = useState({ loaded: token, token });
  const [expired, setExpired] = useState(false);
  const userId = user?.id;
  const queryClient = useQueryClient();
  const shownFor = useRef(userId);

  // A new page load brings a new token from the server, and it wins
  if (session.loaded !== token) setSession({ loaded: token, token });

  // Query keys don't name the user: after signing out and in as someone else in the same tab,
  // the cache would still show the previous person's streak and statistics
  useEffect(() => {
    if (shownFor.current === userId) return;
    shownFor.current = userId;
    void queryClient.resetQueries();
  }, [userId, queryClient]);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, next) => {
      if (next?.access_token) setSession((current) => ({ ...current, token: next.access_token }));
      // Also after the tab wakes up: Supabase checks the session again and drops a dead one
      if (event === "SIGNED_OUT") setExpired(true);
    });

    const interceptor = axios.interceptors.response.use(undefined, async (error: AxiosError) => {
      const request = error.config as RetriedRequest | undefined;
      const isOurApi = !!API && !!request?.url?.startsWith(API);
      if (error.response?.status !== 401 || !request || request.authRetried || !isOurApi) throw error;

      request.authRetried = true;
      const stale = String(request.headers.Authorization ?? "").replace(/^Bearer /, "");
      const renewal = await renewToken(stale);

      if (!renewal.token) {
        if (renewal.expired) setExpired(true);
        throw error;
      }

      setSession((current) => ({ ...current, token: renewal.token }));
      request.headers.Authorization = `Bearer ${renewal.token}`;
      return axios.request(request);
    });

    return () => {
      subscription.unsubscribe();
      axios.interceptors.response.eject(interceptor);
    };
  }, [userId]);

  return (
    <SessionProvider user={user} token={session.token}>
      {children}
      <SessionExpiredModal open={expired && !!user} onClose={() => setExpired(false)} />
    </SessionProvider>
  );
};
