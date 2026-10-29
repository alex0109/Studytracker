import { FC } from "react";
import { BlockColumn, Title } from "@/shared/ui";
import { LimitsOverview } from "@/widgets/LimitsOverview";
import { getServerT } from "@/shared/i18n/server";

const Limits: FC = async () => {
  const { t } = await getServerT();

  return (
    <BlockColumn>
      <Title text={t("nav.limits")} />
      <LimitsOverview />
    </BlockColumn>
  );
};

export default Limits;
