"use client";

import { FC } from "react";
import Link from "next/link";
import {
  LuArrowLeft,
  LuBookA,
  LuBookOpen,
  LuCircleHelp,
  LuExternalLink,
  LuLibrary,
  LuNotebookPen,
  LuPencil,
  LuScrollText,
} from "react-icons/lu";
import { Skeleton } from "@/shared/radix-ui";
import { EmptyState, RichTextStatic } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { ILibraryItem, useLibraryItem } from "@/entities/library";
import { DrawingViewer } from "@/entities/note/ui";
import { NoteTypeEnum } from "@/entities/note/model";
import { QuestionTypeEnum } from "@/entities/question/model";
import { ImportLibraryButton } from "@/features/library/import-from-library";
import { LibraryAuthorActions } from "@/features/library/send-library-request";
import { LibraryContents, LibraryContentsSection } from "./library-contents";
import { LibraryDictionaries } from "./library-dictionaries";
import { LibraryDisclosure } from "./library-disclosure";
import { LibraryQuestions, questionLevels } from "./library-questions";
import { LibrarySection } from "./library-section";

const NOTE_ICONS = {
  [NoteTypeEnum.text]: LuNotebookPen,
  [NoteTypeEnum.drawing]: LuPencil,
  [NoteTypeEnum.summary]: LuScrollText,
} as Record<string, typeof LuNotebookPen>;

const TONES = {
  about: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  notes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  questions: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  dictionaries: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
};

const surface =
  "rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900";

// Margins of the first and last block would only add to the padding around the text
const flushText = "[&>:first-child]:mt-0 [&>:last-child]:mb-0";

const pageWidth = "mx-auto flex w-full max-w-5xl flex-col px-4";

// A library material to read and try out: its text, then notes, questions and words,
// each collapsed into an overview so that a long material doesn't turn into a long scroll
export const LibraryReader: FC<{ itemId: string; initialItem?: ILibraryItem | null }> = ({ itemId, initialItem }) => {
  const { t, i18n } = useTranslation();
  const { libraryItemData: item, libraryItemIsPending, libraryItemError } = useLibraryItem(itemId, initialItem);

  const back = (
    <Link
      href="/library"
      className="flex items-center gap-1.5 self-start text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
    >
      <LuArrowLeft aria-hidden /> {t("library.reader.back")}
    </Link>
  );

  if (libraryItemIsPending) {
    return (
      <div className={cn(pageWidth, "gap-4")}>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-72 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (libraryItemError || !item) {
    return (
      <div className={cn(pageWidth, "gap-4")}>
        {back}
        <EmptyState icon={<LuLibrary />} title={t("library.reader.unavailable")} text={t("library.reader.unavailableText")} />
      </div>
    );
  }

  const { content } = item;
  // Flashcard questions repeat the dictionary words shown below
  const questions = content.questions.filter((question) => question.questionType !== QuestionTypeEnum.Flashcard);
  const dictionaries = content.dictionaries.filter((dictionary) => dictionary.entries.length > 0);
  const formatDate = (value: string) =>
    // In one time zone: the server and the browser must print the same date
    new Date(value).toLocaleDateString(i18n.language, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const wasUpdated = new Date(item.updatedAt).getTime() - new Date(item.publishedAt).getTime() > 60_000;

  const totals = [
    { id: "notes", label: t("library.counts.notes", { count: content.notes.length }), count: content.notes.length, icon: LuNotebookPen },
    { id: "questions", label: t("library.counts.questions", { count: questions.length }), count: questions.length, icon: LuCircleHelp },
    { id: "dictionaries", label: t("library.counts.words", { count: item.wordsCount }), count: item.wordsCount, icon: LuBookA },
  ].filter((total) => total.count > 0);

  const contents: LibraryContentsSection[] = [
    { id: "content", label: t("library.reader.about"), icon: LuBookOpen, parts: [] },
    ...(content.notes.length > 0
      ? [{
          id: "notes",
          label: t("library.reader.sections.notes"),
          icon: LuNotebookPen,
          parts: content.notes.map((note) => ({ id: `note-${note.key}`, label: note.title })),
        }]
      : []),
    ...(questions.length > 0
      ? [{
          id: "questions",
          label: t("library.reader.sections.questions"),
          icon: LuCircleHelp,
          parts: questionLevels(questions).map(({ id, level }) => ({ id, label: t(`library.reader.levels.${level}`) })),
        }]
      : []),
    ...(dictionaries.length > 0
      ? [{
          id: "dictionaries",
          label: t("library.reader.sections.dictionaries"),
          icon: LuBookA,
          parts: dictionaries.map((dictionary, index) => ({ id: `dictionary-${index + 1}`, label: dictionary.title })),
        }]
      : []),
  ];

  return (
    <article className={cn(pageWidth, "gap-5 pb-24")}>
      {back}

      <header className="flex flex-col gap-6 rounded-3xl border border-white/80 bg-gradient-to-br from-emerald-100/80 via-white to-sky-100/70 p-6 shadow-sm duration-500 animate-in fade-in slide-in-from-bottom-3 motion-reduce:animate-none sm:p-10 dark:border-neutral-800 dark:from-emerald-950/60 dark:via-neutral-900 dark:to-sky-950/40">
        <div className="flex flex-col gap-4">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              {t(`materials.types.${item.type}`)}
            </span>
            <span>{t("library.by", { name: item.authorNickname })}</span>
            <span>
              {wasUpdated
                ? t("library.reader.updated", { date: formatDate(item.updatedAt) })
                : t("library.reader.published", { date: formatDate(item.publishedAt) })}
            </span>
          </p>
          <h1 className="max-w-3xl font-serif text-4xl leading-tight text-neutral-900 sm:text-5xl dark:text-neutral-50">{item.title}</h1>

          {content.link && (
            <a
              href={content.link}
              target="_blank"
              rel="noopener noreferrer nofollow ugc"
              className="flex items-center gap-1.5 self-start text-sm text-emerald-700 hover:underline dark:text-emerald-400"
            >
              <LuExternalLink aria-hidden /> {t("library.reader.source")}
            </a>
          )}

          <ImportLibraryButton itemId={item.id} isImported={item.isImported} />

          {item.isMine && (
            <LibraryAuthorActions itemId={item.id} nickname={item.authorNickname} pendingRequest={item.pendingRequest} />
          )}
        </div>

        {totals.length > 0 && (
          <nav aria-label={t("library.reader.contents")} className="grid grid-cols-3 gap-2 sm:gap-3">
            {totals.map(({ id, label, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex flex-col gap-2 rounded-2xl border border-neutral-200/70 bg-white/80 p-3 text-sm font-medium text-neutral-800 transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-4 sm:text-base dark:border-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-100"
              >
                <span aria-hidden className={cn("flex size-9 items-center justify-center rounded-xl", TONES[id as keyof typeof TONES])}>
                  <Icon />
                </span>
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <div className="mt-3 grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <LibraryContents label={t("library.reader.contents")} sections={contents} />

        <div className="flex min-w-0 flex-col gap-10">
          <LibrarySection id="content" title={t("library.reader.about")} icon={LuBookOpen} tone={TONES.about}>
            <div className={cn(surface, "p-5 sm:p-7")}>
              {content.content ? (
                <RichTextStatic content={content.content} className={flushText} />
              ) : (
                <p className="text-neutral-500">{t("library.reader.noContent")}</p>
              )}
            </div>
          </LibrarySection>

          {content.notes.length > 0 && (
            <LibrarySection id="notes" title={t("library.reader.sections.notes")} icon={LuNotebookPen} tone={TONES.notes} foldable>
              <div className="flex flex-col gap-3">
                {content.notes.map((note, index) => {
                  const Icon = NOTE_ICONS[note.type] ?? LuNotebookPen;
                  return (
                    <LibraryDisclosure
                      key={note.key}
                      id={`note-${note.key}`}
                      summary={
                        <>
                          <span
                            aria-hidden
                            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-mono text-sm text-neutral-500 dark:bg-neutral-800"
                          >
                            {index + 1}
                          </span>
                          <h3 className="flex min-w-0 flex-wrap items-center gap-x-2 font-sans text-lg leading-snug font-semibold text-neutral-800 dark:text-neutral-100">
                            {note.title}
                            {note.type !== NoteTypeEnum.text && <Icon aria-hidden className="text-neutral-400" />}
                            {note.type === NoteTypeEnum.summary && (
                              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                                {t("library.reader.summary")}
                              </span>
                            )}
                          </h3>
                        </>
                      }
                    >
                      {note.type === NoteTypeEnum.drawing ? (
                        note.drawingContent ? (
                          <DrawingViewer content={note.drawingContent} title={note.title} />
                        ) : null
                      ) : note.textContent ? (
                        <RichTextStatic content={note.textContent} className={flushText} />
                      ) : (
                        <p className="text-sm text-neutral-500">{t("library.reader.noContent")}</p>
                      )}
                    </LibraryDisclosure>
                  );
                })}
              </div>
            </LibrarySection>
          )}

          {questions.length > 0 && (
            <LibrarySection id="questions" title={t("library.reader.sections.questions")} icon={LuCircleHelp} tone={TONES.questions} foldable>
              <LibraryQuestions questions={questions} />
            </LibrarySection>
          )}

          {dictionaries.length > 0 && (
            <LibrarySection id="dictionaries" title={t("library.reader.sections.dictionaries")} icon={LuBookA} tone={TONES.dictionaries} foldable>
              <LibraryDictionaries dictionaries={dictionaries} />
            </LibrarySection>
          )}

          {!item.isImported && (
            <aside className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-emerald-100/90 to-sky-100/80 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:from-emerald-950/70 dark:to-sky-950/50">
              <div className="flex flex-col gap-1">
                <h2 className="font-serif text-2xl text-neutral-900 dark:text-neutral-50">{t("library.reader.ctaTitle")}</h2>
                <p className="text-neutral-700 dark:text-neutral-300">{t("library.reader.ctaText")}</p>
              </div>
              <div className="shrink-0">
                <ImportLibraryButton itemId={item.id} isImported={item.isImported} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </article>
  );
};
