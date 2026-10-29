import { FC } from "react";
import Link from "next/link";
import { LuBookA, LuCheck, LuCircleHelp, LuDownload, LuNotebookPen } from "react-icons/lu";
import { ILibraryItemSummary } from "@/entities/library";
import { useTranslation } from "@/shared/i18n";

export const LibraryCard: FC<{ item: ILibraryItemSummary }> = ({ item }) => {
  const { t, i18n } = useTranslation();

  return (
    <Link
      href={`/library/${item.id}`}
      className="group flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-emerald-500 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none dark:hover:border-neutral-700"
    >
      <div className="flex items-center justify-between gap-2 text-xs text-neutral-500">
        <span>{t(`materials.types.${item.type}`)}</span>
        <div className="flex gap-1.5">
          {item.isMine && (
            <span className="rounded-full bg-violet-100 px-2 py-0.5 font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              {t("library.yours")}
            </span>
          )}
          {item.isImported && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <LuCheck aria-hidden /> {t("library.inYourMaterials")}
            </span>
          )}
        </div>
      </div>

      <h3 className="line-clamp-2 font-serif text-xl leading-snug text-neutral-900 group-hover:text-emerald-800 dark:text-neutral-50 dark:group-hover:text-emerald-300">
        {item.title}
      </h3>
      <p className="text-sm text-neutral-500">{t("library.by", { name: item.authorNickname })}</p>

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
        {item.notesCount > 0 && (
          <span className="flex items-center gap-1">
            <LuNotebookPen aria-hidden /> {t("library.counts.notes", { count: item.notesCount })}
          </span>
        )}
        {item.questionsCount > 0 && (
          <span className="flex items-center gap-1">
            <LuCircleHelp aria-hidden /> {t("library.counts.questions", { count: item.questionsCount })}
          </span>
        )}
        {item.wordsCount > 0 && (
          <span className="flex items-center gap-1">
            <LuBookA aria-hidden /> {t("library.counts.words", { count: item.wordsCount })}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-400 dark:border-neutral-800">
        <span>
          {new Date(item.publishedAt).toLocaleDateString(i18n.language, { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1">
          <LuDownload aria-hidden /> {t("library.imports", { count: item.importsCount })}
        </span>
      </div>
    </Link>
  );
};
