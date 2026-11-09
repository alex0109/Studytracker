"use client";

import { FC, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { ILibrarySnapshot } from "@/entities/library";
import { EntryTerm, PartOfSpeechBadge } from "@/entities/dictionary";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { LibraryDisclosure } from "./library-disclosure";

type Dictionary = ILibrarySnapshot["dictionaries"][number];
type Entry = Dictionary["entries"][number];

// With only a few words, a search field is just one more thing to look at
const SEARCH_FROM_WORDS = 20;

const wordGrid = "grid gap-2.5 sm:grid-cols-2";

const Word: FC<{ entry: Entry }> = ({ entry }) => {
  const { t } = useTranslation();

  return (
    <li className="flex flex-col gap-1 rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-800/50">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <EntryTerm term={entry.term} article={entry.article} className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-50" />
        {entry.transcription && <span className="text-sm text-neutral-500">{entry.transcription}</span>}
        <PartOfSpeechBadge partOfSpeech={entry.partOfSpeech ?? undefined} />
      </div>
      <p className="text-neutral-700 dark:text-neutral-300">{entry.translation}</p>
      {entry.grammarInfo && <p className="text-xs text-neutral-500">{entry.grammarInfo}</p>}
      {entry.example && <p className="mt-1 font-serif text-sm text-neutral-700 italic dark:text-neutral-300">“{entry.example}”</p>}
      {entry.exampleTranslation && <p className="text-sm text-neutral-500">{entry.exampleTranslation}</p>}
      {entry.synonyms.length > 0 && (
        <p className="text-xs text-neutral-500">{t("library.reader.synonyms", { list: entry.synonyms.join(", ") })}</p>
      )}
    </li>
  );
};

export const LibraryDictionaries: FC<{ dictionaries: Dictionary[] }> = ({ dictionaries }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase();

  const words = dictionaries.flatMap((dictionary, index) =>
    dictionary.entries.map((entry) => ({ entry, key: `${index}-${entry.key}` })),
  );
  const found = query
    ? words.filter(({ entry }) =>
        [entry.term, entry.translation, ...entry.synonyms].some((text) => text.toLocaleLowerCase().includes(query)),
      )
    : [];

  return (
    <>
      {words.length >= SEARCH_FROM_WORDS && (
        <label className="relative">
          <span className="sr-only">{t("library.reader.searchWords")}</span>
          <LuSearch aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={search}
            maxLength={100}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("library.reader.searchWords")}
            className="w-full rounded-2xl border border-neutral-200 bg-white py-2.5 pr-4 pl-11 shadow-xs outline-none focus:border-emerald-400 dark:border-neutral-800 dark:bg-neutral-900"
          />
        </label>
      )}

      {query && (
        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <p role="status" className="text-sm text-neutral-500">
            {found.length > 0 ? t("library.reader.wordsFound", { found: found.length }) : t("library.reader.noWords")}
          </p>
          {found.length > 0 && (
            <ul className={wordGrid}>
              {found.map(({ entry, key }) => (
                <Word key={key} entry={entry} />
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Stays mounted during a search, so the sections keep what the reader had open */}
      <div className={cn("flex flex-col gap-3", query && "hidden")}>
        {dictionaries
          .filter((dictionary) => dictionary.entries.length > 0)
          .map((dictionary, index) => (
            <LibraryDisclosure
              key={index}
              id={`dictionary-${index + 1}`}
              summary={
                <>
                  <h3 className="min-w-0 font-sans text-lg leading-snug font-semibold text-neutral-800 dark:text-neutral-100">{dictionary.title}</h3>
                  <span className="shrink-0 text-sm whitespace-nowrap text-neutral-500">{t("library.counts.words", { count: dictionary.entries.length })}</span>
                </>
              }
            >
              {/* Inside, not in the header: a stuck header with a long description would fill a phone screen */}
              {dictionary.description && <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">{dictionary.description}</p>}
              <ul className={wordGrid}>
                {dictionary.entries.map((entry) => (
                  <Word key={entry.key} entry={entry} />
                ))}
              </ul>
            </LibraryDisclosure>
          ))}
      </div>
    </>
  );
};
