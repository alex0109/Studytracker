"use client";

import { FC, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BlockColumn, CustomInput, Title } from "@/shared/ui";
import { MaterialListItem } from "./material-list-item";
import { routes } from "@/shared/config/routes";
import { EmptyMaterialCarouselItem } from "@/entities/material/ui";
import { filteredMaterials } from "../../lib/filter-materials";
import { useLastOpened, useMaterialAll } from "@/entities/material";
import * as Sentry from "@sentry/react";
import ErrorPage from "@/app/error-page";
import { AddMaterial } from "@/features/material/create-material/ui";
import { AddTag } from "@/features/tag/create-tag";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } },
};

export const MaterialList: FC = () => {
  const [search, setSearch] = useState("");
  const { materialsData } = useMaterialAll();
  const { saveLastOpenedId } = useLastOpened();

  const filtered = useMemo(
    () => (materialsData ? filteredMaterials(materialsData, search) : []),
    [materialsData, search],
  );

  const hasMaterials = !!materialsData && materialsData.length > 0;
  const hasResults = filtered.length > 0;

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

          {!hasMaterials ? (
            <EmptyMaterialCarouselItem />
          ) : (
            <AnimatePresence mode="wait">
              {hasResults ? (
                <motion.div
                  key="material-list"
                  className="flex flex-col w-full gap-3 justify-center items-center"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence mode="popLayout">
                    {filtered.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full flex justify-center"
                      >
                        <Link
                          href={`${routes.materials}/${item.id}`}
                          onClick={() => saveLastOpenedId(item.id)}
                        >
                          <MaterialListItem
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
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  className="flex flex-col items-center justify-center gap-2 py-12 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-lg text-neutral-400">
                    No materials found for “{search.trim()}”
                  </p>
                  <p className="text-sm text-neutral-500">
                    Try a different keyword or check the spelling.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </>
      </BlockColumn>
    </Sentry.ErrorBoundary>
  );
};
