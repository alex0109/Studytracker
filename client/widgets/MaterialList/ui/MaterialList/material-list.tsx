"use client";

import { FC, useState } from "react";
import Link from "next/link";
import {
  BlockColumn,
  ContainerColumn,
  CustomInput,
  Subtitle,
  Title,
} from "@/shared/ui";
import { MaterialListItem } from "./material-list-item";
import { routes } from "@/shared/config/routes";
import { EmptyMaterialCarouselItem } from "@/entities/material/ui";
import { filteredMaterials } from "../../lib/filter-materials";
import { useLastOpened, useMaterialAll } from "@/entities/material";
import * as Sentry from "@sentry/react";
import ErrorPage from "@/app/error-page";
import { AddMaterial } from "@/features/material/create-material/ui";
import { AddTag } from "@/features/tag/create-tag";

export const MaterialList: FC = () => {
  const [search, setSearch] = useState("");
  const { materialsData } = useMaterialAll();

  const { saveLastOpenedId } = useLastOpened();

  return (
    <Sentry.ErrorBoundary fallback={<ErrorPage />}>
      <BlockColumn blockStyles="min-h-[70vh]">
        <>
          <div className="flex flex-col justify-center items-center mb-5">
            <Title text="EXPLORE YOUR MATERIALS" />
            <div className="flex lg:flex-row flex-col w-full justify-center items-center">
              <div className="flex-1" />
              <div className="flex-1 w-full">
                <CustomInput
                  inputBlockStyles="min-w-[250px] lg:w-[400px] md:w-[350px] sm:w-[300px]"
                  inputStyles="bg-neutral-200"
                  placeholder="Search for material"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-1 gap-2 mx-2">
                <AddMaterial />
                <AddTag />
              </div>
            </div>
          </div>
          {!materialsData || materialsData.length == 0 ? (
            <EmptyMaterialCarouselItem />
          ) : (
            <div className="flex flex-col w-full gap-3 justify-center items-center">
              {filteredMaterials(materialsData, search).map((item) => (
                <Link
                  key={item.id}
                  href={`${routes.materials}/${item.id}`}
                  onClick={() => saveLastOpenedId(item.id)}
                >
                  <MaterialListItem
                    key={item.id}
                    id={item.id}
                    assessmentId={item.assessmentId}
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
            </div>
          )}
        </>
      </BlockColumn>
    </Sentry.ErrorBoundary>
  );
};
