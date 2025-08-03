"use client";

import BlockColumn from "@/shared/components/block-column";
import Text from "@/shared/components/text";
import Title from "@/shared/components/title";
import { useParams, useRouter } from "next/navigation";
import CustomButton from "@/shared/components/button";
import StatusBadge from "@/shared/components/status-badge";
import useMaterials from "../hooks/useMaterials.hook";

const MaterialPage = () => {
  const params = useParams();
  const router = useRouter();

  const { exactMaterial, deleteMaterial } = useMaterials(Number(params.id));

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
        <Title text={exactMaterial.title} blockStyles="my-0" />
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
        <div>
          <span className="italic">Status</span>
          <StatusBadge status={exactMaterial.status} />
        </div>
      </BlockColumn>
    </>
  );
};

export default MaterialPage;
