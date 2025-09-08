"use client";

import BlockColumn from "@/shared/components/block-column";

import Title from "@/shared/components/title";
import React from "react";
import Carousel from "./material-carousel.component";
import useMaterials from "../../hooks/useMaterials.hook";

const MaterialCarousel = () => {
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
