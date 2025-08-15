"use client";

import BlockColumn from "@/shared/components/block-column";
import React, { useState } from "react";
import MaterialListItem from "./material-list-item.component";
import useMaterials from "../../hooks/useMaterials.hook";
import { routes } from "@/shared/lib/data";
import Link from "next/link";
import EmptyMaterialItem from "../material-carousel/empty-material-list.component";
import ContainerColumn from "@/shared/components/container-column";
import CustomInput from "@/shared/components/input";
import Subtitle from "@/shared/components/subtitle";
import { filteredMaterials } from "../../utils/filter-materials.util";

const MaterialList = () => {
  const [search, setSearch] = useState("");
  const { materialsData } = useMaterials();

  console.log("ENViroment");
  // console.log("ENV: ", process.env);
  console.log("ENV: ", process.env.NEXT_PUBLIC_API_HTTP);

  return (
    <BlockColumn blockStyles="align-center justify-center">
      {!materialsData || materialsData.length == 0 ? (
        <EmptyMaterialItem />
      ) : (
        <>
          <ContainerColumn>
            <CustomInput
              inputBlockStyles="w-[400px]"
              inputStyles="bg-neutral-200"
              placeholder="Search for material"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Subtitle
              text={`Materials: ${
                filteredMaterials(materialsData, search).length
              }`}
            />
          </ContainerColumn>
          {filteredMaterials(materialsData, search).map((item) => (
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
          ))}
        </>
      )}
    </BlockColumn>
  );
};

export default MaterialList;
