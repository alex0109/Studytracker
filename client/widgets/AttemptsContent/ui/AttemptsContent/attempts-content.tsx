"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { LuChevronRight, LuHistory } from "react-icons/lu";
import { useFinishedAttempts } from "@/entities/attempt";
import { EmptyState } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";

interface AttemptsContentProps {
  materialId: string;
  noteId?: string;
}

export const AttemptsContent: FC<AttemptsContentProps> = ({
  materialId,
  noteId,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { finishedAttempts } = useFinishedAttempts(materialId);

  if (!finishedAttempts || finishedAttempts.length == 0) {
    return (
      <EmptyState
        icon={<LuHistory aria-hidden />}
        title={noteId ? t("attempts.empty.note") : t("attempts.empty.material")}
        text={t("attempts.empty.text")}
      />
    );
  }

  const getAttemptResults = (attemptId: string) => {
    router.push(`/materials/${materialId}/attempt/${attemptId}/results`);
  };

  return (
    <ul className="flex flex-col w-full gap-2">
      {finishedAttempts.map((item) => {
        const score = Math.round(item.score);

        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => getAttemptResults(item.id)}
              className="flex w-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 text-left transition hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-500"
            >
              <span
                className={cn(
                  "flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold tabular-nums",
                  score >= 80
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : score >= 50
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
                )}
              >
                {score}%
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {t("attempts.title", { id: item.id.split("-")[0] })}
                </span>
                <span className="text-sm text-neutral-500">
                  {moment(item.finishedAt).format("D MMMM YYYY, HH:mm")} ·{" "}
                  {t("attempts.correctOf", {
                    correct: item.correctAnswers,
                    total: item.correctAnswers + item.wrongAnswers,
                  })}
                </span>
              </span>
              <span className="hidden items-center gap-1 text-sm font-medium text-neutral-600 sm:flex dark:text-neutral-300">
                {t("attempts.seeResults")} <LuChevronRight aria-hidden />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
