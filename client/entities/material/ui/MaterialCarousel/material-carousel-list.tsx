"use client";

import { FC } from "react";
import { BlockColumn, Title } from "@/shared/ui";
import { MaterialCarousel } from "./material-carousel";
import { useMaterialAll } from "@/entities/material";

export const MaterialCarouselList: FC = () => {
  const { materialsData, materialsIsPending } = useMaterialAll();

  return (
    <BlockColumn>
      <Title text="List" />
      <MaterialCarousel
        materials={materialsData ?? []}
        materialsIsPending={materialsIsPending}
      />
    </BlockColumn>
  );
};
