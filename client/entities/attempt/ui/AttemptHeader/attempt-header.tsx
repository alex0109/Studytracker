"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/radix-ui";
import { Title } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { LuArrowLeft } from "react-icons/lu";

interface AttemptHeaderProps {
  materialId: string;
  attemptId: string;
}

export const AttemptHeader: FC<AttemptHeaderProps> = ({
  materialId,
  attemptId,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center w-full">
      <Button size="lg" variant="outline" className="self-start" onClick={() => router.back()}>
        <LuArrowLeft /> {t("common.back")}
      </Button>
      <Title text={t("attempts.title", { id: attemptId.split("-")[0] })} />
    </div>
  );
};
