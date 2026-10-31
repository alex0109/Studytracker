"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Title, ContainerColumn, BlockColumn } from "@/shared/ui";
import { useRouter } from "next/navigation";
import {
  StatusBadge,
  useLastOpened,
  useMaterialExact,
} from "@/entities/material";
import { Button } from "@/shared/radix-ui";
import { useSession } from "@/shared/context/session.provider";

export const LastOpened: FC = () => {
  const { token, user } = useSession();
  const router = useRouter();

  const { lastOpened } = useLastOpened();
  const { exactMaterialData } = useMaterialExact(lastOpened ?? "");

  // Hooks above run on every render, guests just see nothing
  if (!user || !token || !exactMaterialData) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <ContainerColumn blockStyles="justify-center items-center">
        <Title text="Last Opened" />
        <BlockColumn blockStyles="gap-6 mt-0 bg-neutral-800 min-w-[300px] lg:w-[500px] md:w-[600px] h-[250px] border-neutral-700">
          <Title
            text={exactMaterialData.title}
            textStyles="text-white"
            blockStyles="m-0"
          />
          <div className="border-b-2 rounded-8xl border-neutral-600 w-full" />
          <StatusBadge status={exactMaterialData.status!} />
          <Button
            size="lg"
            variant="outline"
            className="w-[250px] text-black font-semibold"
            onClick={() => router.push(`/materials/${exactMaterialData.id}`)}
          >
            Continue
          </Button>
        </BlockColumn>
      </ContainerColumn>
    </motion.div>
  );
};
