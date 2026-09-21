"use client";

import { FC, useRef, useState } from "react";
import { AccordionContent, AccordionTrigger, BlockRow } from "@/shared/ui";
import { LuPlus } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import * as Accordion from "@radix-ui/react-accordion";
import styles from "@/shared/ui/Accordion/styles.module.css";
import { DrawingBoard } from "@/widgets/DrawingBoard";
import { useMaterialAll } from "@/entities/material";

const testData = [
  { id: "12344", title: "Material #1", notes: [1, 2, 3, 4] },
  { id: "23452346", title: "Material #2", notes: [1, 2] },
  { id: "909192", title: "Material #3", notes: [1, 2] },
  { id: "523123", title: "Material #4", notes: [] },
];

export const MaterialsSideBar: FC = () => {
  const { materialsData, materialsIsPending } = useMaterialAll();
  const [openValue, setOpenValue] = useState<string | undefined>();

  return (
    <BlockRow blockStyles="lg:w-[90%] md:w-[90%] w-full">
      <div className="flex-1 border-r border-neutral-200 h-[500px]">
        <div className="flex flex-col justify-center gap-2 p-5">
          <Accordion.Root
            className={styles.Root}
            type="single"
            value={openValue}
            onValueChange={setOpenValue}
            collapsible
          >
            <Button className="w-full flex justify-between items-center">
              <div>
                <p>Add Material</p>
              </div>

              <div>
                <LuPlus />
              </div>
            </Button>

            {!!materialsData && <></>}

            {materialsData &&
              materialsData.map((item) => (
                <Accordion.Item
                  key={item.id}
                  className={styles.Item}
                  value={item.id}
                >
                  <AccordionTrigger className="flex-1 flex items-start justify-between">
                    <span className="px-2 group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                      {item.title}
                    </span>
                  </AccordionTrigger>

                  <AccordionContent isOpen={openValue === item.id}>
                    <div className="flex flex-col ml-5 pl-2 py-2 gap-2 border-l border-neutral-200">
                      <div className="flex justify-between items-center">
                        <Button
                          variant="ghost"
                          className="w-full flex justify-between items-center hover:bg-neutral-900/10"
                        >
                          <div>
                            <p>Add Note</p>
                          </div>

                          <div>
                            <LuPlus />
                          </div>
                        </Button>
                      </div>

                      {item.notes &&
                        item.notes.map((note, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <Button
                              variant="ghost"
                              className="w-full flex justify-between items-center hover:bg-neutral-900/10"
                            >
                              {note.title}
                            </Button>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </Accordion.Item>
              ))}
          </Accordion.Root>
        </div>
      </div>

      {/* DRAWING AREA */}
      <DrawingBoard />
    </BlockRow>
  );
};
