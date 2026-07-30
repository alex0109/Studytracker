import { FC } from "react";
import { Subtitle } from "@/shared/ui";
import { IsPendingLoader } from "@/shared/ui";

export const LoadingMaterials: FC = () => {
  return (
    <div className="flex items-center justify-center h-[200px] w-full rounded-2xl gap-3 p-2 m-2">
      <Subtitle text={"Loading materials"} textStyles="text-neutral-500" />
      <IsPendingLoader isPending={true} />
    </div>
  );
};
