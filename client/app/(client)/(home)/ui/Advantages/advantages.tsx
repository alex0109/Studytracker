"use client";

import { FC } from "react";
import { ContainerRow } from "@/shared/ui";
import { motion } from "framer-motion";
import { LuLeaf, LuChartSpline, LuLock } from "react-icons/lu";

export const Advantages: FC = () => {
  return (
    <ContainerRow blockStyles="sm:flex-col md:flex-row lg:flex-row gap-10 my-20 justify-center items-center">
      <motion.div
        className="flex w-65 lg:w-65 sm:w-100 h-65 bg-neutral-900 rounded-2xl flex-col justify-center items-center text-white p-5 gap-3"
        initial={{ y: -120, x: 0, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 1 }}
      >
        <h3 className="font-bold">UI/UX</h3>
        <LuLeaf size={36} />
        <p className="text-center text-[16px]">
          Simple.
          <br /> Antioverwhelming design. Makes you <b> focused </b> and
          <b> comfortable </b> to study.
        </p>
      </motion.div>
      <motion.div
        className="flex w-70 lg:w-70 sm:w-120 h-70 bg-neutral-900 rounded-2xl flex-col justify-center items-center text-white p-5 gap-3"
        initial={{ y: -120, x: 0, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 1 }}
      >
        <h3 className="font-bold">Secure</h3>
        <LuLock size={36} />
        <p className="text-center">
          To provide efficient studyplace there is important to provide safety.
          <br />
          <br />
          <b>You can feel safety here.</b>
        </p>
      </motion.div>
      <motion.div
        className="flex w-65 lg:w-65 sm:w-100 h-65 bg-neutral-900 rounded-2xl flex-col justify-center items-center text-white p-5 gap-3"
        initial={{ y: -120, x: 0, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 1 }}
      >
        <h3 className="font-bold">Stats</h3>
        <LuChartSpline size={36} />
        <p className="text-center">
          We collecting only the general numbers so you can <b> observe </b>{" "}
          your <b> effictivness </b>.
        </p>
      </motion.div>
    </ContainerRow>
  );
};
