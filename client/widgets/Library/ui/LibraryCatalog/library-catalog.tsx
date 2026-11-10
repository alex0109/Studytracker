"use client";

import { FC, MouseEvent, ReactNode, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LuChevronLeft, LuChevronRight, LuLibrary, LuSearch, LuSearchX, LuSend } from "react-icons/lu";
import { Button, Skeleton } from "@/shared/radix-ui";
import { EmptyState } from "@/shared/ui";
import { useDebounce } from "@/shared/hooks";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { MATERIAL_TYPES, MaterialTypeEnum } from "@/entities/material";
import { ILibraryPage, useLibraryPage } from "@/entities/library";
import { useRequireAuth } from "@/shared/hooks/use-require-auth";
import { SubmitToLibraryModal } from "@/features/library/send-library-request";
import { LibraryCard } from "./library-card";
import { LibraryRequests } from "./library-requests";

// Every type, in the order the material forms use
const TYPES = MATERIAL_TYPES as readonly string[] as readonly MaterialTypeEnum[];

const pageHref = (page: number) => (page > 1 ? `/library?page=${page}` : "/library");

export const LibraryCatalog: FC<{ initialPage?: ILibraryPage | null }> = ({ initialPage }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<MaterialTypeEnum | undefined>();
  const [submitOpen, setSubmitOpen] = useState(false);
  const requireAuth = useRequireAuth();
  const debouncedSearch = useDebounce(search, 350);

  // The page lives in the address, so every one of them has a link a search engine can follow
  const page = Math.max(1, Number(useSearchParams().get("page")) || 1);
  const isFiltered = !!debouncedSearch.trim() || !!type;

  // A new search or filter starts from the first page
  const startFromFirstPage = () => {
    if (page > 1) window.history.replaceState(null, "", pageHref(1));
  };

  const { libraryPageData, libraryPageIsPending, libraryPageIsFetching, libraryPageError } = useLibraryPage(
    { search: debouncedSearch.trim() || undefined, type, page },
    !isFiltered && initialPage?.page === page ? initialPage : undefined,
  );

  const pages = libraryPageData ? Math.max(1, Math.ceil(libraryPageData.total / libraryPageData.pageSize)) : 1;

  const openPage = (event: MouseEvent, target: number) => {
    // A new tab is still the browser's business
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    window.history.pushState(null, "", pageHref(target));
  };

  const pageLink = (target: number, disabled: boolean, rel: string, label: ReactNode) =>
    disabled ? (
      <Button variant="outline" size="sm" disabled>
        {label}
      </Button>
    ) : (
      <Button asChild variant="outline" size="sm">
        <a href={pageHref(target)} rel={rel} onClick={(event) => openPage(event, target)}>
          {label}
        </a>
      </Button>
    );

  return (
    <div className="flex w-full max-w-6xl flex-col gap-6 px-3 sm:px-5">
      <header className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-white p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8 dark:from-emerald-950/40 dark:to-neutral-900 animate-in fade-in slide-in-from-bottom-3 duration-500 motion-reduce:animate-none">
        <div className="flex max-w-2xl flex-col gap-2">
          <span className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
            <LuLibrary aria-hidden /> {t("library.eyebrow")}
          </span>
          <h1 className="font-serif text-4xl text-neutral-900 dark:text-neutral-50">{t("library.title")}</h1>
          <p className="text-neutral-600 dark:text-neutral-300">{t("library.subtitle")}</p>
        </div>
        <Button size="lg" onClick={() => requireAuth(() => setSubmitOpen(true))} className="self-start sm:self-auto">
          <LuSend aria-hidden /> {t("library.share")}
        </Button>
      </header>

      <LibraryRequests />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">{t("library.searchPlaceholder")}</span>
          <LuSearch aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              startFromFirstPage();
            }}
            maxLength={100}
            placeholder={t("library.searchPlaceholder")}
            className="w-full rounded-2xl border border-neutral-200 bg-white py-2.5 pr-4 pl-11 outline-none focus:border-emerald-400 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </label>
        {/* Ten types and "all": one swipeable row on a phone, wrapped lines on wider screens */}
        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label={t("materials.typeLabel")}
        >
          {[undefined, ...TYPES].map((value) => (
            <button
              key={value ?? "all"}
              type="button"
              aria-pressed={type === value}
              onClick={() => {
                setType(value);
                startFromFirstPage();
              }}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition",
                type === value
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
              )}
            >
              {value ? t(`materials.types.${value}`) : t("library.filters.all")}
            </button>
          ))}
        </div>
      </div>

      {libraryPageIsPending ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : libraryPageError ? (
        <p className="py-10 text-center text-neutral-500">{t("library.loadError")}</p>
      ) : libraryPageData && libraryPageData.items.length > 0 ? (
        <>
          <div
            className={cn(
              "grid gap-4 transition-opacity md:grid-cols-2 lg:grid-cols-3",
              libraryPageIsFetching && "opacity-60",
            )}
          >
            {libraryPageData.items.map((item) => (
              <LibraryCard key={item.id} item={item} />
            ))}
          </div>
          {pages > 1 && (
            <nav className="flex items-center justify-center gap-3" aria-label={t("library.pagination")}>
              {pageLink(page - 1, page <= 1, "prev", <><LuChevronLeft aria-hidden /> {t("library.prev")}</>)}
              <span className="text-sm text-neutral-500">{t("library.page", { page, pages })}</span>
              {pageLink(page + 1, page >= pages, "next", <>{t("library.next")} <LuChevronRight aria-hidden /></>)}
            </nav>
          )}
        </>
      ) : isFiltered ? (
        <EmptyState icon={<LuSearchX />} title={t("library.notFound.title")} text={t("library.notFound.text")} />
      ) : (
        <EmptyState
          icon={<LuLibrary />}
          title={t("library.empty.title")}
          text={t("library.empty.text")}
          action={
            <Button className="mt-2" onClick={() => requireAuth(() => setSubmitOpen(true))}>
              <LuSend aria-hidden /> {t("library.share")}
            </Button>
          }
        />
      )}

      <SubmitToLibraryModal open={submitOpen} setOpen={setSubmitOpen} />
    </div>
  );
};
