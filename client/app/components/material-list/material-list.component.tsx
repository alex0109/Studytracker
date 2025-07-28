"use client";

import BlockColumn from "@/shared/components/block-column";
import Carousel from "@/app/components/material-list/components/material-item-carousel.component";
import Title from "@/shared/components/title";
import React, { useState } from "react";

const MaterialList = () => {
  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: "Stackoverflow article",
      type: "article",
      link: "none",
      tag: "none",
      status: "Finished",
    },
    {
      id: 2,
      title: "Reddit comment",
      type: "comment",
      link: "none",
      tag: "none",
      status: "Want to learn",
    },
    {
      id: 3,
      title: "Random article",
      type: "article",
      link: "none",
      tag: "none",
      status: "Finished",
    },
    {
      id: 4,
      title: "Random article",
      type: "article",
      link: "none",
      tag: "none",
      status: "Finished",
    },
    {
      id: 5,
      title: "Random article",
      type: "article",
      link: "none",
      tag: "none",
      status: "Finished",
    },
    {
      id: 6,
      title: "Random article and something long in name",
      type: "article",
      link: "none",
      tag: "none",
      status: "Finished",
    },
    {
      id: 7,
      title: "Random article",
      type: "article",
      link: "none",
      tag: "none",
      status: "Finished",
    },
  ]);

  return (
    <BlockColumn blockStyles="">
      <Title text="List" />
      <Carousel materials={materials} />
    </BlockColumn>
  );
};

export default MaterialList;
