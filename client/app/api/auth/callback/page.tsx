"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/supabase/client";
import ContainerColumn from "@/shared/components/container-column";
import Title from "@/shared/components/title";

export default function AuthCallback() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        router.push("/materials");
      }
    });
  }, [router]);

  return (
    <ContainerColumn blockStyles="h-[60vh]">
      <Title text="Siging in...⏳" />
    </ContainerColumn>
  );
}
