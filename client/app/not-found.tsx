"use client";

import { FC } from "react";
import Title from "@/shared/components/title";
import CustomButton from "@/shared/components/button";
import { redirect } from "next/navigation";

const NotFound: FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-[90vh] py-10">
      <div>
        <Title text="404 | NOT FOUND" />
        <CustomButton title="Go home" onClick={() => redirect("/")} />
      </div>
    </div>
  );
};

export default NotFound;
