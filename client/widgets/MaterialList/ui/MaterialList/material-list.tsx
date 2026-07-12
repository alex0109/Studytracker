"use client";

import { FC, useState } from "react";
import Link from "next/link";
import {
  BlockColumn,
  ContainerColumn,
  CustomInput,
  Subtitle,
} from "@/shared/ui";
import { MaterialListItem } from "./material-list-item";
import { routes } from "@/shared/config/routes";
import { EmptyMaterialCarouselItem } from "@/entities/material/ui";
import { filteredMaterials } from "../../lib/filter-materials";
import { useLastOpened } from "@/shared/hooks";
import { useMaterialAll } from "@/entities/material";
import * as Sentry from "@sentry/react";
import ErrorPage from "@/app/error-page";

export const MaterialList: FC = () => {
  const [search, setSearch] = useState("");
  const { materialsData } = useMaterialAll();

  const { saveLastOpenedId } = useLastOpened();

  return (
    <Sentry.ErrorBoundary fallback={<ErrorPage />}>
      <BlockColumn blockStyles="align-center justify-center">
        {!materialsData || materialsData.length == 0 ? (
          <EmptyMaterialCarouselItem />
        ) : (
          <>
            <ContainerColumn blockStyles="justify-center items-center">
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
                  materialTags={item.materialTags}
                  link={item.link}
                  status={item.status}
                  type={item.type}
                  createdAt={item.createdAt}
                  updatedAt={item.updatedAt}
                  isActive={item.isActive}
                  version={item.version}
                />
              </Link>
            ))}
          </>
        )}
      </BlockColumn>
    </Sentry.ErrorBoundary>
  );
};
