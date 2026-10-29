"use client";

import { FC } from "react";
import { Title } from "@/shared/ui";
import { redirect } from "next/navigation";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";

const NotFound: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center items-center w-full h-[90vh] py-10">
      <div className="flex flex-col items-center">
        <Title text={`404 | ${t("errors.notFound")}`} />
        <Button size="lg" onClick={() => redirect("/")}>
          {t("errors.goHome")}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
