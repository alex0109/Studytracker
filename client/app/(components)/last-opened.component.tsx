"use client";

import React, { FC } from "react";
import Title from "@/shared/components/title";
import ContainerColumn from "@/shared/components/container-column";
import useLastOpened from "@/shared/hooks/use-last-opened.hook";
import CustomButton from "@/shared/components/button";
import BlockColumn from "@/shared/components/block-column";

const LastOpened: FC = () => {
  const { saveLastOpenedId, lastOpened } = useLastOpened();

  console.log(lastOpened);
  return (
    <ContainerColumn>
      <Title text="Last Opened" />
      <BlockColumn blockStyles="mt-0 bg-neutral-800 min-w-[300px] lg:w-[500px] md:w-[600px] h-[300px] border-neutral-700">
        <Title text="Article about JS" textStyles="text-neutral-100" />
        <CustomButton
          title="Continue"
          buttonStyles="w-[250px] bg-neutral-100 text-black font-semibold"
        />
      </BlockColumn>
    </ContainerColumn>
  );
};

export default LastOpened;
