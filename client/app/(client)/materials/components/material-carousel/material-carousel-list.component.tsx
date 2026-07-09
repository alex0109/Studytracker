"use client";

import { FC } from "react";
import { BlockColumn, Title } from "@/shared/ui";
import Carousel from "./material-carousel.component";
import useMaterialAll from "../../../../../entities/material/hooks/useMaterialAll";

const MaterialCarousel: FC = () => {
  const { materialsData, materialsLoading } = useMaterialAll();

  return (
    <BlockColumn>
      <Title text="List" />
      <Carousel
        materials={materialsData ?? []}
        materialsLoading={materialsLoading}
      />
    </BlockColumn>
  );
};

export default MaterialCarousel;
