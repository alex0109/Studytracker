"use client";

import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuCalendarCheck, LuChevronDown, LuInbox, LuTrash2, LuX } from "react-icons/lu";
import { INotification } from "@/entities/notification";
import { useNotificationsDismiss, useNotificationsRead } from "@/features/reminders";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { DigestCard } from "./digest-card";
import { NotificationText } from "./notification-text";

// The newest few are shown; the rest open in a scrolling list, so many reminders never stretch the page
const SHOWN = 5;

interface NotificationsInboxProps {
  notifications: INotification[];
  unreadCount: number;
}

export const NotificationsInbox: FC<NotificationsInboxProps> = ({ notifications, unreadCount }) => {
  const { t, i18n } = useTranslation();
  const { markRead, markAllRead, markAllReadIsPending } = useNotificationsRead();
  const { dismiss, dismissAll, dismissAllIsPending } = useNotificationsDismiss();
  const [expanded, setExpanded] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const hidden = Math.max(0, notifications.length - SHOWN);
  const shown = expanded ? notifications : notifications.slice(0, SHOWN);

  return (
    <DigestCard icon={<LuInbox aria-hidden />} title={t("digest.inbox.title")}>
      {notifications.length === 0 ? (
        <p className="text-sm text-neutral-500">{t("digest.inbox.empty")}</p>
      ) : (
        <>
          <ul className={cn("flex flex-col gap-1", expanded && "max-h-96 overflow-y-auto pr-1")}>
            <AnimatePresence initial={false}>
              {shown.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="group flex items-start gap-1 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <button
                    type="button"
                    onClick={() => !item.readAt && markRead(item.id)}
                    className="flex min-w-0 flex-1 items-start gap-3 px-2 py-2 text-left"
                  >
                    <span
                      aria-hidden
                      className={cn("mt-1.5 size-2 shrink-0 rounded-full", item.readAt ? "bg-transparent" : "bg-violet-500")}
                    />
                    <span className="flex min-w-0 flex-col">
                      <span
                        className={cn(
                          "text-sm",
                          item.readAt ? "text-neutral-600 dark:text-neutral-400" : "font-medium text-neutral-900 dark:text-neutral-100",
                        )}
                      >
                        <NotificationText item={item} />
                      </span>
                      <span className="text-xs text-neutral-400">
                        {new Date(item.createdAt).toLocaleString(i18n.language, {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                  </button>
                  {/* Always there on a phone, on hover and focus on a computer */}
                  <button
                    type="button"
                    onClick={() => dismiss(item.id)}
                    aria-label={t("digest.inbox.delete")}
                    title={t("digest.inbox.delete")}
                    className="mt-1 mr-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-200 hover:text-red-600 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-neutral-700"
                  >
                    <LuX aria-hidden />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {hidden > 0 && (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 self-start rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              <LuChevronDown aria-hidden className={cn("transition", expanded && "rotate-180")} />
              {expanded ? t("digest.inbox.showLess") : t("digest.inbox.showMore", { count: hidden })}
            </button>
          )}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
            {unreadCount > 0 ? (
              <button
                type="button"
                disabled={markAllReadIsPending}
                onClick={() => markAllRead()}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                <LuCalendarCheck className="mr-1 inline" aria-hidden />
                {t("digest.inbox.markAll", { count: unreadCount })}
              </button>
            ) : (
              <span />
            )}
            {/* Clearing everything asks once more */}
            <button
              type="button"
              disabled={dismissAllIsPending}
              onClick={() => {
                if (!confirmClear) {
                  setConfirmClear(true);
                  return;
                }
                setConfirmClear(false);
                setExpanded(false);
                dismissAll();
              }}
              onBlur={() => setConfirmClear(false)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium transition",
                confirmClear
                  ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                  : "text-neutral-500 hover:text-red-600",
              )}
            >
              <LuTrash2 aria-hidden />
              {confirmClear ? t("digest.inbox.clearConfirm") : t("digest.inbox.clearAll")}
            </button>
          </div>
        </>
      )}
    </DigestCard>
  );
};
