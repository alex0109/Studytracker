import React, { FC } from "react";
import Subtitle from "@/shared/components/subtitle";
import { useSession } from "@/shared/context/session-provider.context";

const EmptyMaterialItem: FC = () => {
  const { user } = useSession();

  return (
    <div className="flex items-center justify-center h-[200px] w-full rounded-2xl p-2 m-2 border-3 border-neutral-600 border-dashed">
      <Subtitle
        text={
          !user
            ? "Sign up/sign in to add your material..."
            : `No materials yet...`
        }
        textStyles="text-neutral-500"
      />
    </div>
  );
};

export default EmptyMaterialItem;
