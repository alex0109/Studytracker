"use client";

import { FC, useEffect, useState } from "react";
import {
  Title,
  ContainerColumn,
  CustomButton,
  BlockColumn,
  StatusBadge,
} from "@/shared/ui";
import { useRouter } from "next/navigation";
import { useLastOpened } from "@/shared/hooks";
import { useMaterialExact } from "@/entities/material";

export const LastOpened: FC = () => {
  const router = useRouter();

  const [lastOpenedMaterialID, setLastOpenedMaterialID] = useState<string>("");

  const { lastOpened } = useLastOpened();

  const { exactMaterial, exactMaterialError } =
    useMaterialExact(lastOpenedMaterialID);

  useEffect(() => {
    if (lastOpened) {
      setLastOpenedMaterialID(lastOpened);
    }
  }, [exactMaterial, exactMaterialError, lastOpened]);

  if (!exactMaterial) {
    return null;
  }

  return (
    <ContainerColumn blockStyles="justify-center items-center">
      <Title text="Last Opened" />
      <BlockColumn blockStyles="gap-6 mt-0 bg-neutral-800 min-w-[300px] lg:w-[500px] md:w-[600px] h-[300px] border-neutral-700">
        <Title
          text={exactMaterial.title}
          textStyles="text-neutral-100"
          blockStyles="m-0"
        />
        <div className="border-b-2 rounded-8xl border-neutral-600 w-full" />
        <StatusBadge status={exactMaterial.status!} />
        <CustomButton
          title="Continue"
          buttonStyles="w-[250px] bg-neutral-100 text-black font-semibold"
          onClick={() => router.push(`/materials/${exactMaterial.id}`)}
        />
      </BlockColumn>
    </ContainerColumn>
  );
};
