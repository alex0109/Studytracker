"use client";

import { useRouter } from "next/navigation";
import { MaterialDate } from "@/entities/material/ui";
import {
  MaterialTitle,
  MaterialType,
} from "@/features/material/update-material/ui";
import { BlockColumn, CustomButton } from "@/shared/ui";
import { MaterialTypeEnum } from "@/entities/material";
import { FC } from "react";

interface MaterialHeaderType {
  id: string;
  title: string;
  type: MaterialTypeEnum;
  createdAt: Date;
  setOpen: (isOpen: boolean) => void;
}

export const MaterialHeader: FC<MaterialHeaderType> = ({
  id,
  title,
  type,
  createdAt,
  setOpen,
}) => {
  const router = useRouter();

  return (
    <BlockColumn>
      <div className="flex w-full justify-between">
        <div>
          <CustomButton onClick={() => router.back()} title="Go back" />
        </div>
        <div>
          <CustomButton
            buttonStyles="bg-rose-600 border-rose-500"
            onClick={() => setOpen(true)}
            title="Delete"
          />
        </div>
      </div>
      <MaterialTitle id={id} title={title} />
      <MaterialType id={id} type={type} />
      <MaterialDate createdAt={createdAt} />
    </BlockColumn>
  );
};
