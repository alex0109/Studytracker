"use client";

import { FC } from "react";
import { Title } from "@/shared/ui";
import { redirect } from "next/navigation";
import { Button } from "@/shared/radix-ui";

const NotFound: FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-[90vh] py-10">
      <div>
        <Title text="404 | NOT FOUND" />
        <Button size="lg" onClick={() => redirect("/")}>
          Go home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
