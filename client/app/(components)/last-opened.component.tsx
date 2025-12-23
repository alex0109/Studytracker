"use client";

import React, { FC } from "react";
import Title from "@/shared/components/title";
import ContainerColumn from "@/shared/components/container-column";
import CustomButton from "@/shared/components/button";
import BlockColumn from "@/shared/components/block-column";
import StatusBadge from "@/shared/components/status-badge";
import { redirect } from "next/navigation";

interface LastOpenedProps {
  id: number;
  title: string;
  status: "tolearn" | "inprocess" | "finished" | undefined;
}

const LastOpened: FC<LastOpenedProps> = ({ id, title, status }) => {
  return (
    <ContainerColumn>
      <Title text="Last Opened" />
      <BlockColumn blockStyles="gap-6 mt-0 bg-neutral-800 min-w-[300px] lg:w-[500px] md:w-[600px] h-[300px] border-neutral-700">
        <Title text={title} textStyles="text-neutral-100" blockStyles="m-0" />
        <div className="border-b-2 rounded-8xl border-neutral-600 w-full" />
        <StatusBadge status={status!} />
        <CustomButton
          title="Continue"
          buttonStyles="w-[250px] bg-neutral-100 text-black font-semibold"
          onClick={() => redirect(`/materials/${id}`)}
        />
      </BlockColumn>
    </ContainerColumn>
  );
};

export default LastOpened;
