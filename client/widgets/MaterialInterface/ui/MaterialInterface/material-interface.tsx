import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { Button } from "@/shared/radix-ui";
import { ContainerRow } from "@/shared/ui";
import { motion } from "framer-motion";
import { materialInterface } from "../../lib/material-interface";

export const MaterialInterface = () => {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();

  return (
    <ContainerRow blockStyles="flex w-full items-start justify-center gap-5">
      {materialInterface.map((item) => (
        <motion.div
          key={item.key}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Button
            size="lg"
            className="text-lg hover:bg-transparent relative"
            variant="ghost"
            onClick={() => {
              setActiveSection(item.name);
              setTimeOfLastClick(Date.now());
            }}
          >
            {item.icon} {item.name}
            {item.name === activeSection && (
              <motion.span
                className=" bg-gray-100 rounded-full 
                    absolute inset-0 -z-10 dark:bg-neutral-950"
                layoutId="activeSection"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                }}
              ></motion.span>
            )}
          </Button>
        </motion.div>
      ))}
    </ContainerRow>
  );
};
