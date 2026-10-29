"use client";

import { IsPendingLoader, Subtitle } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";

const LoadingQuestions = () => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full my-5 justify-center items-center gap-3">
      <Subtitle text={t("questions.loading")} textStyles="text-neutral-500" />
      <IsPendingLoader isPending={true} />
    </div>
  );
};

export default LoadingQuestions;
