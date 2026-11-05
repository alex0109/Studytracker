"use client";

import { useEffect, useState } from "react";

// A request that ends in leaving for another site (Stripe) is over before that site opens, and
// the button would come back in the meantime. This keeps it busy until the page is gone; back
// from that site the browser may restore the page as it was, so the flag is dropped then
export const useLeavingPage = <T = true>() => {
  const [leaving, setLeaving] = useState<T>();

  useEffect(() => {
    const restore = (event: PageTransitionEvent) => event.persisted && setLeaving(undefined);
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, []);

  const leave = (url: string, reason: T) => {
    setLeaving(() => reason);
    window.location.assign(url);
  };

  return { leaving, leave };
};
