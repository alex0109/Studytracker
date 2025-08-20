"use client";

import { User } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext } from "react";

interface SessionProviderProps {
  user: User | null;
  children: ReactNode;
}

const SessionContext = createContext<User | null>(null);

export function SessionProvider({ user, children }: SessionProviderProps) {
  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
