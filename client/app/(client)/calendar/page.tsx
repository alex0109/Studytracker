import { ActivityCalendar } from "@/widgets/ActivityCalendar";
import { DeadlinesSection } from "@/widgets/Deadlines";
import { getServerT } from "@/shared/i18n/server";

const CalendarPage = async () => {
  const { t } = await getServerT();

  return (
    <div className="flex w-full flex-col items-center gap-6 px-4 pb-16">
      <header className="flex w-full max-w-5xl flex-col gap-1">
        <h1 className="text-3xl! font-semibold!">{t("calendar.title")}</h1>
        <p className="text-sm text-neutral-500">{t("calendar.subtitle")}</p>
      </header>
      <ActivityCalendar />
      <DeadlinesSection />
    </div>
  );
};

export default CalendarPage;
