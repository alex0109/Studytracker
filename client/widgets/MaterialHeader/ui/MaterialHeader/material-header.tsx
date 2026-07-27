"use client";

import { useRouter } from "next/navigation";
import { MaterialDate } from "@/entities/material/ui";
import {
  MaterialTitle,
  MaterialType,
} from "@/features/material/update-material/ui";
import { BlockColumn } from "@/shared/ui";
import { MaterialTypeEnum } from "@/entities/material";
import { FC } from "react";
import { Button } from "@/shared/radix-ui";

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
          <Button size="lg" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
        <div>
          <Button size="lg" variant="destructive" onClick={() => setOpen(true)}>
            Delete
          </Button>
        </div>
      </div>
      <MaterialTitle id={id} title={title} />
      <MaterialType id={id} type={type} />
      <MaterialDate createdAt={createdAt} />
    </BlockColumn>
  );
};
