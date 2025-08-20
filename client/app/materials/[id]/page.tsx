"use client";

import BlockColumn from "@/shared/components/block-column";
import Text from "@/shared/components/text";
import Title from "@/shared/components/title";
import { useParams, useRouter } from "next/navigation";
import CustomButton from "@/shared/components/button";
import StatusBadge from "@/shared/components/status-badge";
import useMaterials from "../hooks/useMaterials.hook";
import CustomInput from "@/shared/components/input";
import StatusBadgeSelect from "@/shared/components/status-select";
import { useState } from "react";

const MaterialPage = () => {
  const params = useParams();
  const router = useRouter();

  const { exactMaterial, deleteMaterial } = useMaterials(Number(params.id));
  const [status, setStatus] = useState<
    "tolearn" | "inprocess" | "finished" | undefined
  >(exactMaterial?.status);

  const handleDeleteMaterial = async (id: number) => {
    deleteMaterial(id);
    router.back();
  };

  if (!exactMaterial) {
    return (
      <BlockColumn>
        <Text text="Loading..." />
      </BlockColumn>
    );
  }

  return (
    <>
      <BlockColumn>
        <div className="flex w-full justify-between">
          <div>
            <CustomButton onClick={() => router.back()} title="Go back" />
          </div>
          <div>
            <CustomButton
              buttonStyles="bg-rose-600 border-rose-500"
              onClick={() => handleDeleteMaterial(exactMaterial.id)}
              title="Delete"
            />
          </div>
        </div>
        <CustomInput
          defaultValue={exactMaterial.title}
          inputStyles="text-2xl font-bold text-center outline-none"
        />
        <Text text="Type" />
        <Text text={`ID ${exactMaterial.id}`} />
      </BlockColumn>
      <BlockColumn blockStyles="p-[70px] items-start">
        <div>
          <span className="italic">Tag</span>
          <Text text={exactMaterial.tag ?? ""} textStyles="pl-5" />
        </div>
        <div>
          <span className="italic">Link</span>
          <Text text={exactMaterial.link ?? ""} textStyles="pl-5" />
        </div>
        {/* <div>
          <span className="italic">Status</span>
          <StatusBadge status={exactMaterial.status} />
        </div> */}
        <div>
          <span className="italic">Status</span>
          <StatusBadgeSelect status={status}>
            <select className="text-white outline-none cursor-pointer">
              <option value="tolearn">Want to learn</option>
              <option value="inprocess">In process</option>
              <option value="finished">Finished</option>
            </select>
          </StatusBadgeSelect>
        </div>
      </BlockColumn>
    </>
  );
};

export default MaterialPage;
