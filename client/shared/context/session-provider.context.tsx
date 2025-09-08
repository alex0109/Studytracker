"use client";

import { User } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext } from "react";

interface SessionProviderProps {
  user: User | null;
  token: string | undefined;
  children: ReactNode;
}

const SessionContext = createContext<{
  user: User | null;
  token: string | undefined;
}>({ user: null, token: undefined });

export function SessionProvider({
  user,
  token,
  children,
}: SessionProviderProps) {
  return (
    <SessionContext.Provider value={{ user: user, token: token }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
