"use client";

import { FC, useState } from "react";
import { motion } from "framer-motion";

import Link from "next/link";

import { authorizedLinks, links } from "../../config/data";
import { useSession } from "../../context/session.provider";

import { Title } from "../Title";
import { signOut } from "@/app/(client)/(auth)/actions";
import { Modal } from "../Modal";
import { CustomButton } from "../Button";

export const Navigation: FC = () => {
  const { user } = useSession();

  const [open, setOpen] = useState(false);

  const handleLogOut = () => {
    signOut();
    setOpen(false);
  };

  const mappedLinkList = !user ? links : authorizedLinks;

  return (
    <header className="z-40 relative">
      <motion.div
        className="
      z-40 fixed top-0 left-1/2 
      h-[4.5rem] w-full border-white bg-white shadow-lg 
      shadow-black/[0.03] backdrop-blur-[0.5rem] 
      sm:top-6 sm:h-[3.25rem] sm:w-[36rem] 
      sm:rounded-tl-[160px] sm:rounded-br-[160px] sm:rounded-bl-[16px] sm:rounded-tr-[16px] dark:bg-neutral-900"
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
      ></motion.div>
      <nav className="z-40 flex fixed top-[0.15rem] left-1/2 h-12 -translate-x-1/2 sm:top-[1.7rem] sm:h-[initial] sm:py-0 w-[22rem] sm:w-[36rem] justify-center items-center">
        <ul className="flex w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium sm:w-[initial] sm:flex-nowrap sm:gap-5">
          {mappedLinkList.map((link) => (
            <motion.li
              className="h-3/4 flex items-center justify-center relative"
              key={link.hash}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Link
                className={
                  "flex w-full items-center justify-center px-3 py-3 hover:text-gray-950 transition dark:text-gray-300 dark:hover:text-gray-200"
                }
                href={link.hash}
              >
                {link.name}
              </Link>
            </motion.li>
          ))}
        </ul>
        {user && (
          <motion.div
            className="absolute right-0 bottom-1 flex justify-center items-center h-12 px-5 cursor-pointer text-[0.9rem] font-medium sm:rounded-full text-red-500"
            onClick={() => setOpen(true)}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Sign out
          </motion.div>
        )}
      </nav>
      {user && (
        <motion.div
          className="z-40 fixed top-[4.2rem] left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 rounded-full border-[0.5px] border-neutral-600 w-[22rem] h-10 sm:w-[26rem] justify-end items-center pt-2"
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
          <CustomButton title="Sign out" onClick={handleLogOut} />
        </div>
      </Modal>
    </header>
  );
};
