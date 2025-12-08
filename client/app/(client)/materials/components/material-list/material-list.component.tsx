"use client";

import React, { FC, useState } from "react";
import BlockColumn from "@/shared/components/block-column";
import MaterialListItem from "./material-list-item.component";
import useMaterials from "../../hooks/useMaterials.hook";
import { routes } from "@/shared/lib/routes";
import Link from "next/link";
import EmptyMaterialItem from "../material-carousel/empty-material-list.component";
import ContainerColumn from "@/shared/components/container-column";
import CustomInput from "@/shared/components/input";
import Subtitle from "@/shared/components/subtitle";
import { filteredMaterials } from "../../utils/filter-materials.util";

const MaterialList: FC = () => {
  const [search, setSearch] = useState("");
  const { materialsData } = useMaterials();

  return (
    <BlockColumn blockStyles="align-center justify-center">
      {!materialsData || materialsData.length == 0 ? (
        <EmptyMaterialItem />
      ) : (
        <>
          <ContainerColumn>
            <CustomInput
              inputBlockStyles="min-w-[250px] lg:w-[400px] md:w-[350px] sm:w-[300px]"
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
                tags={item.tags}
                link={item.link}
                status={item.status}
                type={item.type}
                created_at={item.created_at}
              />
            </Link>
          ))}
        </>
      )}
    </BlockColumn>
  );
};

export default MaterialList;
