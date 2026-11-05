"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

// router.push returns at once while the next page is still loading. Inside a transition the
// button stays busy until that page is there, so a second click can't repeat the action
export const usePendingNavigation = () => {
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();

  const navigate = (href: string, options?: { replace?: boolean }) =>
    startTransition(() => (options?.replace ? router.replace(href) : router.push(href)));

  return { navigate, isNavigating };
};
