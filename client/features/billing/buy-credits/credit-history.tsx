"use client";

import { FC, useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { cn, formatDateTime } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { ICreditTransaction, useCreditHistory } from "@/entities/billing";

// One page of the history; the next one loads under it
const HistoryPage: FC<{ page: number; onMore?: () => void }> = ({ page, onMore }) => {
  const { t, i18n } = useTranslation();
  const { creditHistory, creditHistoryIsPending } = useCreditHistory(page);

  if (creditHistoryIsPending) return <LuLoaderCircle aria-hidden className="mx-auto animate-spin text-neutral-400" />;
  if (!creditHistory || (page === 1 && creditHistory.items.length === 0))
    return page === 1 ? <p className="text-sm text-neutral-500">{t("credits.historyEmpty")}</p> : null;

  const hasMore = creditHistory.page * creditHistory.pageSize < creditHistory.total;
  const label = (item: ICreditTransaction) =>
    item.feature ? `${t(`credits.reasons.${item.reason}`)} · ${t(`ai.features.${item.feature}` as "ai.features.QuestionGeneration")}` : t(`credits.reasons.${item.reason}`);

  return (
    <>
      {creditHistory.items.map((item) => (
        <li key={item.id} className="flex items-start justify-between gap-3 py-2 text-sm">
          <span className="flex min-w-0 flex-col">
            <span className="truncate">{label(item)}</span>
            <span className="text-xs text-neutral-500">{formatDateTime(item.createdAt, i18n.language)}</span>
          </span>
          <span className={cn("shrink-0 font-semibold tabular-nums", item.delta > 0 ? "text-emerald-600" : "text-neutral-700 dark:text-neutral-200")}>
            {item.delta > 0 ? `+${item.delta}` : item.delta}
          </span>
        </li>
      ))}
      {hasMore && onMore && (
        <li className="pt-2">
          <Button variant="ghost" size="sm" onClick={onMore} className="w-full">
            {t("credits.more")}
          </Button>
        </li>
      )}
    </>
  );
};

export const CreditHistory: FC = () => {
  const [pages, setPages] = useState(1);

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
        {Array.from({ length: pages }, (_, index) => (
          <HistoryPage key={index} page={index + 1} onMore={index + 1 === pages ? () => setPages(pages + 1) : undefined} />
        ))}
      </ul>
    </div>
  );
};
