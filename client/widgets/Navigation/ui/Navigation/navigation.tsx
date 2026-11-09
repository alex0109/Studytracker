"use client";
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuMenu, LuUserRound, LuX } from "react-icons/lu";
import { authorizedLinks, links } from "@/shared/config/data";
import { useSession } from "@/shared/context/session.provider";
import { useTranslation } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { PreferencesControls } from "@/features/preferences";
import { SignOutButton } from "@/features/account/sign-out";
import { AccountLink } from "../AccountLink/account-link";
import { LogoLink } from "../LogoLink/logo-link";
import { ProfileSync } from "@/features/profile";
import { TodayCount } from "./today-count";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export const Navigation: FC = () => {
  const { t } = useTranslation();
  const { user } = useSession();
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  const mappedLinkList = !user ? links : authorizedLinks;
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="z-40 relative">
      {user && <ProfileSync />}
      {/* The bar slides in with CSS: the server HTML is visible at once, a phone no longer waits for
          the scripts to see it. It is opaque, so no backdrop blur. On desktop it grows with what is
          inside, so one more link or a longer language can't push anything out of it.
          Three columns: the links stay centred and the side items can't run into them */}
      <nav
        aria-label={t("nav.home")}
        className="z-40 fixed inset-x-0 top-0 flex h-[4.5rem] w-full items-center justify-between
        gap-2 bg-white px-4 shadow-lg shadow-black/[0.03]
        md:inset-x-auto md:left-1/2 md:top-6 md:grid md:h-[3.25rem] md:w-fit
        md:min-w-[min(50rem,calc(100vw-2rem))] md:max-w-[calc(100vw-2rem)] md:-translate-x-1/2
        md:grid-cols-[1fr_auto_1fr] md:px-8
        md:rounded-tl-[160px] md:rounded-br-[160px] md:rounded-bl-[16px] md:rounded-tr-[16px]
        dark:bg-neutral-900 dark:shadow-black/40
        animate-in fade-in slide-in-from-top-8 duration-500 motion-reduce:animate-none"
      >
        <LogoLink className="md:col-start-1 md:justify-self-start md:size-9" />

        <ul className="hidden md:col-start-2 md:flex items-center justify-center gap-0.5 text-[0.875rem] font-medium">
          {mappedLinkList.map((link) => {
            const active = isActive(pathname, link.hash);
            const label = t(`nav.${link.name}`);

            return (
              <li className="flex items-center justify-center" key={link.hash}>
                <Link
                  aria-current={active ? "page" : undefined}
                  title={label}
                  className={cn(
                    "flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 transition",
                    active
                      ? "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
                      : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white",
                  )}
                  href={link.hash}
                >
                  <link.icon aria-hidden className="size-4 shrink-0" />
                  {/* All the links of a signed-in user need a wide screen; on a narrower one only
                      the current page keeps its word, the rest stay readable to screen readers */}
                  <span className={cn(user && !active && "sr-only lg:not-sr-only")}>{label}</span>
                  {link.name === "today" && <TodayCount />}
                </Link>
              </li>
            );
          })}
        </ul>

        {user && (
          <SignOutButton
            variant="icon"
            className="hidden md:col-start-3 md:flex md:justify-self-end"
          />
        )}

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <PreferencesControls />
          <button
            type="button"
            aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex items-center justify-center w-10 h-10 rounded-full text-neutral-900 dark:text-neutral-100"
          >
            {mobileOpen ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Desktop: account, language and theme in the top right corner of the page,
          on narrow desktops a row lower so they don't cover the menu */}
      <div className="z-40 fixed md:top-20 xl:top-6 right-6 hidden md:flex items-center gap-2">
        {user && <AccountLink />}
        <PreferencesControls />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="z-30 fixed top-[4.5rem] left-0 w-full bg-white dark:bg-neutral-900 shadow-lg md:hidden overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="flex flex-col items-center py-4 gap-1 text-[0.95rem] font-medium">
              {/* The account first: on a phone there is no room for its icon next to the language */}
              {user && (
                <li className="w-full px-6 pb-2 mb-1 border-b border-neutral-200 dark:border-neutral-700">
                  <Link
                    href="/account"
                    onClick={closeMobile}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <LuUserRound aria-hidden />
                    </span>
                    <span className="flex min-w-0 flex-col text-left">
                      <span className="text-neutral-900 dark:text-neutral-100">{t("nav.account")}</span>
                      <span className="truncate text-xs font-normal text-neutral-500">{user.email}</span>
                    </span>
                  </Link>
                </li>
              )}

              {mappedLinkList.map((link) => (
                <li key={link.hash} className="w-full text-center">
                  <Link
                    aria-current={isActive(pathname, link.hash) ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center justify-center gap-2 px-3 py-3 transition",
                      isActive(pathname, link.hash)
                        ? "text-neutral-950 dark:text-white"
                        : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white",
                    )}
                    href={link.hash}
                    onClick={closeMobile}
                  >
                    <link.icon aria-hidden className="size-[1.1rem] shrink-0" />
                    {t(`nav.${link.name}`)}
                    {link.name === "today" && <TodayCount />}
                  </Link>
                </li>
              ))}

              {user && (
                <li className="w-full text-center border-t border-neutral-200 dark:border-neutral-700 mt-2 pt-2">
                  <SignOutButton variant="row" />
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Only who is signed in; the account itself opens from the icon next to the language.
          Above the menu bar, so its edge doesn't cover the top of the pill */}
      {user && (
        <div
          className="z-50 fixed top-[4.2rem] left-1/2 -translate-x-1/2 bg-white
          dark:bg-neutral-900 rounded-full border-[0.5px] border-neutral-600 w-[22rem]
          h-10 hidden md:flex lg:w-[26rem] justify-center items-start px-4 pt-2
          animate-in fade-in slide-in-from-top-8 duration-500 motion-reduce:animate-none"
        >
          <p className="max-w-[24rem] truncate text-center text-sm text-neutral-900 dark:text-neutral-300">
            {user.email}
          </p>
        </div>
      )}
    </header>
  );
};
