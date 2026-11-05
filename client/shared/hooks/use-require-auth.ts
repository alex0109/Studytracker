"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/shared/context/session.provider";

// For what guests can see but not do: instead of the action they go to sign in, and come back to
// the same page afterwards
export const useRequireAuth = () => {
  const { user } = useSession();
  const router = useRouter();

  return (action: () => void) => {
    if (user) {
      action();
      return;
    }

    const back = `${window.location.pathname}${window.location.search}`;
    router.push(`/sign-in?redirect=${encodeURIComponent(back)}`);
  };
};
