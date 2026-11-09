import { FC, Suspense } from "react";
import type { Metadata } from "next";
import { BlockColumn } from "@/shared/ui/BlockColumn";
import { Title } from "@/shared/ui/Title";
import { DuoJoin } from "@/features/billing/duo";
import { getServerT } from "@/shared/i18n/server";

// A personal invite: nothing for search engines
export const metadata: Metadata = { robots: { index: false, follow: false } };

const DuoJoinPage: FC = async () => {
  const { t } = await getServerT();

  return (
    <BlockColumn>
      <Title text={t("duo.join.title")} />
      {/* Reads ?token= from the invite link */}
      <Suspense fallback={null}>
        <DuoJoin />
      </Suspense>
    </BlockColumn>
  );
};

export default DuoJoinPage;
