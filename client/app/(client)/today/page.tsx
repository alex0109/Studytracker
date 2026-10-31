import { TodayReview } from "@/widgets/TodayReview";
import { getServerT } from "@/shared/i18n/server";

const Today = async () => {
  const { t } = await getServerT();

  return (
    <div className="flex w-full flex-col items-center gap-6 px-4 pb-16">
      <header className="flex w-full max-w-2xl flex-col gap-1">
        <h1 className="text-3xl! font-semibold!">{t("today.title")}</h1>
        <p className="text-sm text-neutral-500">{t("today.subtitle")}</p>
      </header>
      <TodayReview />
    </div>
  );
};

export default Today;
