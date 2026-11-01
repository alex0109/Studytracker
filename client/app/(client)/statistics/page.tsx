import { FC } from "react";
import { BlockColumn } from "@/shared/ui/BlockColumn";
import { Title } from "@/shared/ui/Title";
import { StatisticsDashboard } from "@/entities/statistics/ui";
import { StudyDigest } from "@/widgets/StudyDigest";
import { getServerT } from "@/shared/i18n/server";

const Statistics: FC = async () => {
  const { t } = await getServerT();

  return (
    <BlockColumn blockStyles="gap-6">
      <Title text={t("nav.statistics")} />
      <StudyDigest />
      <StatisticsDashboard />
    </BlockColumn>
  );
};

export default Statistics;
