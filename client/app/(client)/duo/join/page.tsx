import { FC, Suspense } from "react";
import type { Metadata } from "next";
import { DuoJoin } from "@/features/billing/duo";
import { getServerT } from "@/shared/i18n/server";

// A personal invite: nothing for search engines
export const metadata: Metadata = { robots: { index: false, follow: false } };

// One card in the middle of the page: who invites and one button
const DuoJoinPage: FC = async () => {
  const { t } = await getServerT();

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6 px-4 pb-20">
      <h1 className="text-center text-3xl! font-semibold! tracking-tight">{t("duo.join.title")}</h1>
      {/* Reads ?token= from the invite link */}
      <Suspense fallback={null}>
        <DuoJoin />
      </Suspense>
    </div>
  );
};

export default DuoJoinPage;
