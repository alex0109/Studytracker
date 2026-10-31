"use client";

import { FC, ReactNode } from "react";
import Link from "next/link";
import {
  LuArrowLeft,
  LuBookA,
  LuCircleHelp,
  LuExternalLink,
  LuLibrary,
  LuNotebookPen,
  LuPencil,
  LuScrollText,
} from "react-icons/lu";
import { Skeleton } from "@/shared/radix-ui";
import { EmptyState, RichTextViewer } from "@/shared/ui";
import { useTranslation } from "@/shared/i18n";
import { useLibraryItem } from "@/entities/library";
import { DrawingViewer } from "@/entities/note/ui";
import { NoteTypeEnum } from "@/entities/note/model";
import { QuestionTypeEnum } from "@/entities/question/model";
import { PartOfSpeechBadge } from "@/entities/dictionary/ui";
import { ImportLibraryButton } from "@/features/library/import-from-library";
import { LibraryAuthorActions } from "@/features/library/send-library-request";
import { LibraryQuestion } from "./library-question";

const NOTE_ICONS = {
  [NoteTypeEnum.text]: LuNotebookPen,
  [NoteTypeEnum.drawing]: LuPencil,
  [NoteTypeEnum.summary]: LuScrollText,
} as Record<string, typeof LuNotebookPen>;

const Section: FC<{ id: string; title: string; children: ReactNode }> = ({ id, title, children }) => (
  <section id={id} className="flex scroll-mt-28 flex-col gap-5 border-t border-neutral-200 pt-10 dark:border-neutral-800">
    <h2 className="font-sans text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{title}</h2>
    {children}
  </section>
);

// A library material laid out for reading: its text, then notes, then questions, then words.
// Nothing here can be edited or answered
export const LibraryReader: FC<{ itemId: string }> = ({ itemId }) => {
  const { t, i18n } = useTranslation();
  const { libraryItemData: item, libraryItemIsPending, libraryItemError } = useLibraryItem(itemId);

  const back = (
    <Link
      href="/library"
      className="flex items-center gap-1.5 self-start text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
    >
      <LuArrowLeft aria-hidden /> {t("library.reader.back")}
    </Link>
  );

  if (libraryItemIsPending) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (libraryItemError || !item) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4">
        {back}
        <EmptyState icon={<LuLibrary />} title={t("library.reader.unavailable")} text={t("library.reader.unavailableText")} />
      </div>
    );
  }

  const { content } = item;
  // Flashcard questions repeat the dictionary words shown below
  const questions = content.questions.filter((question) => question.questionType !== QuestionTypeEnum.Flashcard);
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(i18n.language, { day: "numeric", month: "long", year: "numeric" });
  const wasUpdated = new Date(item.updatedAt).getTime() - new Date(item.publishedAt).getTime() > 60_000;

  const contents = [
    { id: "notes", label: t("library.reader.sections.notes"), count: content.notes.length, icon: LuNotebookPen },
    { id: "questions", label: t("library.reader.sections.questions"), count: questions.length, icon: LuCircleHelp },
    { id: "dictionaries", label: t("library.reader.sections.dictionaries"), count: item.wordsCount, icon: LuBookA },
  ].filter((section) => section.count > 0);

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pb-24">
      {back}

      <header className="flex flex-col gap-4">
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-neutral-500">
          <span>{t(`materials.types.${item.type}`)}</span>
          <span aria-hidden>·</span>
          <span>{t("library.by", { name: item.authorNickname })}</span>
          <span aria-hidden>·</span>
          <span>
            {wasUpdated
              ? t("library.reader.updated", { date: formatDate(item.updatedAt) })
              : t("library.reader.published", { date: formatDate(item.publishedAt) })}
          </span>
        </p>
        <h1 className="font-serif text-4xl leading-tight text-neutral-900 sm:text-5xl dark:text-neutral-50">{item.title}</h1>

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

        <div className="flex flex-wrap items-start gap-4">
          <ImportLibraryButton itemId={item.id} isImported={item.isImported} />
        </div>

        {item.isMine && (
          <LibraryAuthorActions itemId={item.id} nickname={item.authorNickname} pendingRequest={item.pendingRequest} />
        )}

        {contents.length > 0 && (
          <nav aria-label={t("library.reader.contents")} className="flex flex-wrap gap-2">
            {contents.map(({ id, label, count, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                <Icon aria-hidden /> {label} <span className="text-neutral-400">{count}</span>
              </a>
            ))}
          </nav>
        )}
      </header>

      <div id="content">
        {content.content ? (
          <RichTextViewer content={content.content} />
        ) : (
          <p className="text-neutral-500">{t("library.reader.noContent")}</p>
        )}
      </div>

      {content.notes.length > 0 && (
        <Section id="notes" title={t("library.reader.sections.notes")}>
          {content.notes.map((note) => {
            const Icon = NOTE_ICONS[note.type] ?? LuNotebookPen;
            return (
              <div key={note.key} className="flex flex-col gap-3">
                <h3 className="flex items-center gap-2 font-sans text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                  <Icon aria-hidden className="text-neutral-400" /> {note.title}
                  {note.type === NoteTypeEnum.summary && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                      {t("library.reader.summary")}
                    </span>
                  )}
                </h3>
                {note.type === NoteTypeEnum.drawing ? (
                  note.drawingContent ? (
                    <DrawingViewer content={note.drawingContent} title={note.title} />
                  ) : null
                ) : note.textContent ? (
                  <RichTextViewer content={note.textContent} />
                ) : (
                  <p className="text-sm text-neutral-500">{t("library.reader.noContent")}</p>
                )}
              </div>
            );
          })}
        </Section>
      )}

      {questions.length > 0 && (
        <Section id="questions" title={t("library.reader.sections.questions")}>
          <p className="-mt-2 text-sm text-neutral-500">{t("library.reader.demo")}</p>
          <ol className="flex flex-col gap-4">
            {questions.map((question, index) => (
              <LibraryQuestion key={index} question={question} number={index + 1} />
            ))}
          </ol>
        </Section>
      )}

      {content.dictionaries.some((dictionary) => dictionary.entries.length > 0) && (
        <Section id="dictionaries" title={t("library.reader.sections.dictionaries")}>
          {content.dictionaries.map((dictionary, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div>
                <h3 className="font-sans text-lg font-semibold text-neutral-800 dark:text-neutral-100">{dictionary.title}</h3>
                {dictionary.description && <p className="text-sm text-neutral-500">{dictionary.description}</p>}
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {dictionary.entries.map((entry) => (
                  <li key={entry.key} className="flex flex-col gap-1 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-50">{entry.term}</span>
                      {entry.transcription && <span className="text-sm text-neutral-500">{entry.transcription}</span>}
                      <PartOfSpeechBadge partOfSpeech={entry.partOfSpeech ?? undefined} />
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300">{entry.translation}</p>
                    {entry.grammarInfo && <p className="text-xs text-neutral-500">{entry.grammarInfo}</p>}
                    {entry.example && (
                      <p className="mt-1 font-serif text-sm text-neutral-700 italic dark:text-neutral-300">“{entry.example}”</p>
                    )}
                    {entry.exampleTranslation && <p className="text-sm text-neutral-500">{entry.exampleTranslation}</p>}
                    {entry.synonyms.length > 0 && (
                      <p className="text-xs text-neutral-500">{t("library.reader.synonyms", { list: entry.synonyms.join(", ") })}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}
    </article>
  );
};
