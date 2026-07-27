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

export const Navigation: FC = () => {
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
      <motion.div
        className="z-40 fixed top-0 left-1/2 
        h-[4.5rem] w-full border-white bg-white shadow-lg 
        shadow-black/[0.03] backdrop-blur-[0.5rem] 
        md:top-6 md:h-[3.25rem] md:w-[36rem] 
        md:rounded-tl-[160px] md:rounded-br-[160px] md:rounded-bl-[16px] md:rounded-tr-[16px] dark:bg-neutral-900"
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
      />

      <nav
        className="z-40 fixed inset-x-0 top-0 flex h-[4.5rem] w-full items-center 
        justify-between px-5 overflow-hidden md:inset-x-auto md:left-1/2 
        md:-translate-x-1/2 md:top-[1.7rem] md:h-[initial] md:w-[36rem] md:px-0 
        md:justify-center md:overflow-visible"
      >
        <ul className="hidden md:flex items-center justify-center gap-5 text-[0.9rem] font-medium">
          {mappedLinkList.map((link) => (
            <motion.li
              className="h-3/4 flex items-center justify-center relative"
              key={link.hash}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Link
                className="flex w-full items-center justify-center px-3 py-3 hover:text-gray-950 transition dark:text-gray-300 dark:hover:text-gray-200"
                href={link.hash}
              >
                {link.name}
              </Link>
            </motion.li>
          ))}
        </ul>

        {user && (
          <motion.div
            className="hidden md:flex absolute right-0 bottom-1 justify-center items-center h-12 px-5 cursor-pointer text-[0.9rem] font-medium rounded-full text-red-500"
            onClick={() => setOpen(true)}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Sign out
          </motion.div>
        )}

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex md:hidden items-center justify-center w-10 h-10 ml-auto rounded-full text-neutral-900 dark:text-neutral-100"
        >
          {mobileOpen ? <LuX size={22} /> : <LuMenu size={22} />}
        </button>
      </nav>

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
                    className="block w-full px-3 py-3 hover:text-gray-950 transition dark:text-gray-300 dark:hover:text-gray-200"
                    href={link.hash}
                    onClick={closeMobile}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {user && (
                <>
                  <li className="w-full px-6 pt-2">
                    <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 truncate">
                      {user?.email}
                    </p>
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
                      Sign out
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
          h-10 hidden md:flex md:w-[26rem] justify-center items-center pt-2"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className="text-center text-sm text-neutral-900 dark:text-neutral-300">
            {user?.email}
          </p>
        </motion.div>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col w-[200px] h-[200px] justify-center items-center gap-1">
          <Title text="Are you sure?" />
          <Button size="lg" variant="destructive" onClick={handleLogOut}>
            Sign out
          </Button>
        </div>
      </Modal>
    </header>
  );
};
