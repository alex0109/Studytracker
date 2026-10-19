import { FC } from "react";
import { useActiveSectionContext } from "@/shared/context/active-section.provider";
import { Button, Separator } from "@/shared/radix-ui";
import { motion } from "framer-motion";
import type { switchInterfaceType } from "./switch-interface.type";

interface SwitchInterfaceProps {
  switchInterface: switchInterfaceType[];
}

export const SwitchInterface: FC<SwitchInterfaceProps> = ({
  switchInterface,
}) => {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();

  return (
    <div className="flex flex-col w-full justify-center items-start rounded-2xl my-2">
      <div className="flex md:flex-row flex-col w-full justify-center items-start gap-5 rounded-2xl p-5">
        {switchInterface.map((item) => (
          <motion.div
            key={item.key}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex md:flex-row flex-col w-full justify-center items-center gap-5"
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
            </Button>
          </motion.div>
        ))}
      </div>
      <Separator />
    </div>
  );
};
