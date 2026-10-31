"use client";
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LuMenu, LuX } from "react-icons/lu";
import { authorizedLinks, links } from "@/shared/config/data";
import { useSession } from "@/shared/context/session.provider";
import { Title, Modal } from "@/shared/ui";
import { signOut } from "@/entities/auth";
import { Button } from "@/shared/radix-ui";
import { useTranslation } from "@/shared/i18n";
import { PreferencesControls } from "@/features/preferences";
import { StreakBadge } from "../StreakBadge/streak-badge";
import { ProfileSync } from "@/features/profile";
import { TodayCount } from "./today-count";

export const Navigation: FC = () => {
  const { t } = useTranslation();
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogOut = () => {
    signOut();
    setOpen(false);
    setMobileOpen(false);
  };

  const mappedLinkList = !user ? links : authorizedLinks;
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="z-40 relative">
      {user && <ProfileSync />}
      <motion.div
        className="z-40 fixed top-0 left-1/2 
        h-[4.5rem] w-full border-white bg-white shadow-lg 
        shadow-black/[0.03] backdrop-blur-[0.5rem] 
        md:top-6 md:h-[3.25rem] md:w-[50rem] 
        md:rounded-tl-[160px] md:rounded-br-[160px] md:rounded-bl-[16px] md:rounded-tr-[16px] dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-black/40"
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
      />

      {/* On desktop the menu covers the bar exactly, so everything sits on its middle line.
          Three columns: the links stay centred and the side items can't run into them */}
      <nav
        aria-label={t("nav.home")}
        className="z-40 fixed inset-x-0 top-0 flex h-[4.5rem] w-full items-center
        justify-between gap-2 px-4 md:inset-x-auto md:left-1/2
        md:-translate-x-1/2 md:top-6 md:grid md:h-[3.25rem] md:w-[44rem]
        md:max-w-[calc(100vw-2rem)] md:grid-cols-[1fr_auto_1fr] md:px-0"
      >
        {user && (
          <StreakBadge className="md:col-start-1 md:justify-self-start md:size-9" />
        )}

        <ul className="hidden md:col-start-2 md:flex items-center justify-center gap-0.5 text-[0.9rem] font-medium">
          {mappedLinkList.map((link) => (
            <motion.li
              className="flex items-center justify-center"
              key={link.hash}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Link
                className="flex items-center justify-center whitespace-nowrap px-2.5 py-2 text-neutral-700 hover:text-neutral-950 transition dark:text-neutral-300 dark:hover:text-white"
                href={link.hash}
              >
                {t(`nav.${link.name}`)}
                {link.name === "today" && <TodayCount />}
              </Link>
            </motion.li>
          ))}
        </ul>

        {user && (
          <motion.button
            type="button"
            className="hidden md:col-start-3 md:flex md:justify-self-end
                      shrink-0 items-center justify-center h-9 px-3 cursor-pointer
                      whitespace-nowrap text-[0.9rem] font-medium rounded-full
                      text-red-500 transition hover:text-red-600 dark:hover:text-red-400"
            onClick={() => setOpen(true)}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {t("nav.signOut")}
          </motion.button>
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

      {/* Desktop: language and theme in the top right corner of the page,
          on narrow desktops a row lower so they don't cover the menu */}
      <PreferencesControls className="z-40 fixed md:top-[4.4rem] lg:top-6 right-6 hidden md:flex" />

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
              {mappedLinkList.map((link) => (
                <li key={link.hash} className="w-full text-center">
                  <Link
                    className="block w-full px-3 py-3 text-neutral-800 hover:text-neutral-950 transition dark:text-neutral-200 dark:hover:text-white"
                    href={link.hash}
                    onClick={closeMobile}
                  >
                    {t(`nav.${link.name}`)}
                    {link.name === "today" && <TodayCount />}
                  </Link>
                </li>
              ))}

              {user && (
                <>
                  <li className="w-full px-6 pt-2">
                    <Link
                      href="/account"
                      onClick={closeMobile}
                      className="block text-center text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 truncate"
                    >
                      {user?.email}
                      <span className="block text-xs text-neutral-400">
                        {t("nav.account")}
                      </span>
                    </Link>
                  </li>
                  <li className="w-full text-center border-t border-neutral-200 dark:border-neutral-700 mt-2 pt-2">
                    <button
                      type="button"
                      className="w-full px-3 py-3 text-red-500 font-medium"
                      onClick={() => {
                        setOpen(true);
                        setMobileOpen(false);
                      }}
                    >
                      {t("nav.signOut")}
                    </button>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {user && (
        <motion.div
          className="z-40 fixed top-[4.2rem] left-1/2 -translate-x-1/2 bg-white 
          dark:bg-neutral-900 rounded-full border-[0.5px] border-neutral-600 w-[22rem] 
          h-10 hidden md:flex md:w-[26rem] justify-center items-start pt-2"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {/* The email opens the account page: export, deletion, later profile and learning settings */}
          <Link
            href="/account"
            title={t("nav.account")}
            className="max-w-[24rem] truncate text-center text-sm text-neutral-900 hover:underline underline-offset-4 dark:text-neutral-300"
          >
            {user?.email}
          </Link>
        </motion.div>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col w-[220px] h-[200px] justify-center items-center gap-1">
          <Title text={t("nav.signOutConfirm")} />
          <Button size="lg" variant="destructive" onClick={handleLogOut}>
            {t("nav.signOut")}
          </Button>
        </div>
      </Modal>
    </header>
  );
};
