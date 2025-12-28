"use client";

import BlockColumn from "@/shared/components/block-column";

import Title from "@/shared/components/title";
import React, { FC } from "react";
import Carousel from "./material-carousel.component";
import useMaterials from "../../hooks/useMaterials.hook";

const MaterialCarousel: FC = () => {
  const { materialsData, materialsLoading } = useMaterials();

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
