"use client";

import ProgressBadge from "@/shared/components/progress-badge";
import BlockColumn from "@/shared/components/block-column";
import Text from "@/shared/components/text";
import Title from "@/shared/components/title";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CustomButton from "@/shared/components/button";
import { getOneMaterial } from "@/app/services/materials/material.service";
import { MaterialItemProps } from "../components/material-list/types";

const MaterialPage = () => {
  const [material, setMaterial] = useState<MaterialItemProps>({
    id: 0,
    title: "none",
    type: "test",
    tag: "none",
    link: "null",
    status: "tolearn",
  });

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    getOneMaterial(params.id).then(setMaterial).catch(console.error);
  }, []);

  return (
    <>
      <BlockColumn>
        <div className="flex w-full">
          <div className="flex justify-end">
            <CustomButton onClick={() => router.back()} title="Go back" />
          </div>
        </div>
        <Title text={material.title} blockStyles="my-0" />
        <Text text="Type" />
        <Text text={`ID ${material.id}`} />
      </BlockColumn>
      <BlockColumn blockStyles="p-[70px] items-start">
        <div>
          <span className="italic">Tag</span>
          <Text text={material.tag ?? ""} textStyles="pl-5" />
        </div>
        <div>
          <span className="italic">Link</span>
          <Text text={material.link ?? ""} textStyles="pl-5" />
        </div>
        <div>
          <span className="italic">Status</span>
          <ProgressBadge status={material.status} value={material.status} />
        </div>
      </BlockColumn>
    </>
  );
};

export default MaterialPage;
