"use client";

import BlockColumn from "@/shared/components/block-column";

import Title from "@/shared/components/title";
import React, { useEffect, useState } from "react";
import { getAllMaterials } from "@/app/services/materials/material.service";
import Carousel from "./material-item-carousel.component";

const MaterialList = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    getAllMaterials().then(setMaterials).catch(console.error);
  }, []);

  return (
    <BlockColumn blockStyles="">
      <Title text="List" />
      <Carousel materials={materials} />
    </BlockColumn>
  );
};

export default MaterialList;
