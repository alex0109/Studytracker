"use client";

import { FC } from "react";
import { useForm, useWatch } from "react-hook-form";
import { LuSend } from "react-icons/lu";
import { cn } from "@/shared/lib";
import { useTranslation } from "@/shared/i18n";
import { useSession } from "@/shared/context/session.provider";
import { useFeedbackSend } from "../../hooks/useFeedbackSend";
import { FeedbackCategory, IFeedbackCreate } from "../../model/feedback.type";

const CATEGORIES: FeedbackCategory[] = ["Idea", "Bug", "Praise", "Other"];
const MIN_MESSAGE = 10;
const MAX_MESSAGE = 3000;

const fieldStyles =
  "w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-400 dark:focus:ring-neutral-800";

export const FeedbackForm: FC = () => {
  const { t } = useTranslation();
  const { user } = useSession();
  const { sendFeedback, sendFeedbackIsPending } = useFeedbackSend();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IFeedbackCreate>({
    defaultValues: { category: "Idea", email: user?.email ?? "" },
  });

  const category = useWatch({ control, name: "category" });
  const messageLength = useWatch({ control, name: "message" })?.length ?? 0;

  const onSubmit = async (values: IFeedbackCreate) => {
    try {
      await sendFeedback({
        ...values,
        name: values.name?.trim() || undefined,
        email: values.email?.trim() || undefined,
        message: values.message.trim(),
      });
      reset({ category: "Idea", email: values.email, message: "", name: values.name });
    } catch {
      // The hook already tells the user
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div role="radiogroup" aria-label={t("feedback.category")} className="flex flex-wrap gap-2">
        {CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={category === item}
            onClick={() => setValue("category", item)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              category === item
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300",
            )}
          >
            {t(`feedback.categories.${item}`)}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {t("feedback.name")}
          <input
            {...register("name", { maxLength: 100 })}
            autoComplete="name"
            maxLength={100}
            placeholder={t("feedback.namePlaceholder")}
            className={fieldStyles}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {t("feedback.email")}
          <input
            {...register("email", {
              maxLength: 254,
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t("feedback.errors.email") },
            })}
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder={t("feedback.emailPlaceholder")}
            className={fieldStyles}
          />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {t("feedback.message")}
        <textarea
          {...register("message", {
            validate: (value) =>
              (value?.trim().length ?? 0) >= MIN_MESSAGE ||
              t("feedback.errors.message", { count: MIN_MESSAGE }),
          })}
          rows={5}
          maxLength={MAX_MESSAGE}
          placeholder={t("feedback.messagePlaceholder")}
          className={cn(fieldStyles, "resize-y")}
        />
        <span className="flex justify-between text-xs font-normal">
          <span className="text-red-500">{errors.message?.message}</span>
          <span className="text-neutral-400 tabular-nums">
            {messageLength}/{MAX_MESSAGE}
          </span>
        </span>
      </label>

      {/* Not shown to people; a filled value marks a bot */}
      <input
        {...register("website")}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{t("feedback.privacy")}</p>
        <button
          type="submit"
          disabled={sendFeedbackIsPending}
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-neutral-900 px-6 font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
        >
          <LuSend aria-hidden />
          {sendFeedbackIsPending ? t("feedback.sending") : t("feedback.send")}
        </button>
      </div>
    </form>
  );
};
