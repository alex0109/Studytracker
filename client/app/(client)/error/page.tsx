import { FC } from "react";
import { ContainerColumn, Title } from "@/shared/ui";
import { getServerT } from "@/shared/i18n/server";

const ErrorPage: FC = async () => {
  const { t } = await getServerT();

  return (
    <ContainerColumn blockStyles="h-[60vh]">
      <Title text={t("errors.generic")} />
    </ContainerColumn>
  );
};

export default ErrorPage;
