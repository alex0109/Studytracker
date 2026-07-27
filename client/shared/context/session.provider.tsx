"use client";

import { createContext, ReactNode, useContext } from "react";
import { User } from "@supabase/supabase-js";

interface SessionProviderProps {
  user: User | null;
  token: string | undefined;
  children: ReactNode;
}

const SessionContext = createContext<{
  user: User | null;
  token: string | undefined;
}>({ user: null, token: undefined });

export const SessionProvider = ({
  user,
  token,
  children,
}: SessionProviderProps) => {
  return (
    <SessionContext.Provider value={{ user: user, token: token }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
