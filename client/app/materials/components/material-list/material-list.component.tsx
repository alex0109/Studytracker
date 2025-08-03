"use client";

import BlockColumn from "@/shared/components/block-column";
import React from "react";
import MaterialListItem from "./material-list-item.component";
import useMaterials from "../../hooks/useMaterials.hook";
import { routes } from "@/shared/lib/data";
import Link from "next/link";
import EmptyMaterialItem from "../material-carousel/empty-material-list.component";

const MaterialList = () => {
  const { materialsData } = useMaterials();

  return (
    <BlockColumn blockStyles="align-center justify-center">
      {!materialsData || materialsData.length == 0 ? (
        <EmptyMaterialItem />
      ) : (
        materialsData.map((item) => (
          <Link key={item.id} href={`${routes.materials}/${item.id}`}>
            <MaterialListItem
              key={item.id}
              id={item.id}
              title={item.title}
              tag={item.tag}
              link={item.link}
              status={item.status}
              type={item.type}
            />
          </Link>
        ))
      )}
    </BlockColumn>
  );
};

export default MaterialList;
