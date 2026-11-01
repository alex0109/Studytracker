import { FC } from "react";
import { ContainerColumn } from "@/shared/ui/ContainerColumn";
import { Title } from "@/shared/ui/Title";
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
