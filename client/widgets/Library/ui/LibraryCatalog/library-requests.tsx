"use client";

import { FC } from "react";
import { LuInbox } from "react-icons/lu";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import {
  LibraryRequestStatusEnum,
  LibraryRequestTypeEnum,
  useMyLibraryRequests,
} from "@/entities/library";
import { useLibraryRequestCancel } from "@/features/library/send-library-request";

const TYPE_STYLES: Record<LibraryRequestTypeEnum, string> = {
  [LibraryRequestTypeEnum.Publish]: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  [LibraryRequestTypeEnum.Update]: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  [LibraryRequestTypeEnum.Remove]: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

const STATUS_STYLES: Record<LibraryRequestStatusEnum, string> = {
  [LibraryRequestStatusEnum.Pending]: "text-amber-700 dark:text-amber-400",
  [LibraryRequestStatusEnum.Approved]: "text-emerald-700 dark:text-emerald-400",
  [LibraryRequestStatusEnum.Rejected]: "text-rose-700 dark:text-rose-400",
  [LibraryRequestStatusEnum.Cancelled]: "text-neutral-500",
};

// The author's own requests with their marker and where they stand
export const LibraryRequests: FC = () => {
  const { t, i18n } = useTranslation();
  const { libraryRequestsData } = useMyLibraryRequests();
  const { cancelLibraryRequest, cancelLibraryRequestIsPending } = useLibraryRequestCancel();

  if (!libraryRequestsData?.length) return null;

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <header className="flex items-center gap-2">
        <LuInbox aria-hidden className="text-neutral-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{t("library.requests.title")}</h2>
      </header>
      <ul className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
        {libraryRequestsData.map((request) => (
          <li key={request.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 first:pt-0 last:pb-0">
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", TYPE_STYLES[request.type])}>
              {t(`library.requests.types.${request.type}`)}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium text-neutral-800 dark:text-neutral-100">{request.title}</span>
            <span className={cn("text-sm font-medium", STATUS_STYLES[request.status])}>
              {t(`library.requests.statuses.${request.status}`)}
            </span>
            <span className="text-xs text-neutral-400">
              {new Date(request.createdAt).toLocaleDateString(i18n.language, { day: "numeric", month: "short" })}
            </span>
            {request.status === LibraryRequestStatusEnum.Pending && (
              <Button
                size="sm"
                variant="ghost"
                disabled={cancelLibraryRequestIsPending}
                onClick={() => cancelLibraryRequest(request.id)}
              >
                {t("library.requests.cancel")}
              </Button>
            )}
            {request.rejectionReason && (
              <p className="w-full text-sm text-rose-700 dark:text-rose-400">
                {t(`library.requests.reasons.${request.rejectionReason}`)}
              </p>
            )}
            {request.reviewComment && (
              <p className="w-full text-sm text-neutral-500">{t("library.requests.reviewComment", { comment: request.reviewComment })}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
