"use client";

import React, { FC, useState } from "react";
import BlockColumn from "@/shared/components/block-column";
import MaterialListItem from "./material-list-item.component";
import { routes } from "@/shared/lib/routes";
import Link from "next/link";
import EmptyMaterialItem from "../material-carousel/empty-material-list.component";
import ContainerColumn from "@/shared/components/container-column";
import CustomInput from "@/shared/components/input";
import Subtitle from "@/shared/components/subtitle";
import { filteredMaterials } from "../../utils/filter-materials.util";
import useLastOpened from "@/shared/hooks/use-last-opened.hook";
import useMaterialAll from "../../hooks/useMaterialAll.hook";
import * as Sentry from "@sentry/react";
import ErrorPage from "@/app/error-page";

const MaterialList: FC = () => {
  const [search, setSearch] = useState("");
  const { materialsData } = useMaterialAll();

  const { saveLastOpenedId } = useLastOpened();

  return (
    <Sentry.ErrorBoundary fallback={<ErrorPage />}>
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
              <Link
                key={item.id}
                href={`${routes.materials}/${item.id}`}
                onClick={() => saveLastOpenedId(item.id)}
              >
                <MaterialListItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  tags={item.tags}
                  link={item.link}
                  status={item.status}
                  type={item.type}
                  created_at={item.created_at}
                  updated_at={item.updated_at}
                />
              </Link>
            ))}
          </>
        )}
      </BlockColumn>
    </Sentry.ErrorBoundary>
  );
};

export default MaterialList;
