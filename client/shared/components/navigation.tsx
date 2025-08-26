"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

import Link from "next/link";

import clsx from "clsx";

import { authorizedLinks, links } from "../lib/data";
import { useActiveSectionContext } from "../context/active-section.context";
import { useSession } from "../context/session-provider.context";
import Modal from "./modal";
import CustomButton from "./button";
import Title from "./title";
import { signOut } from "@/app/(auth)/actions";

const Navigation = () => {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();

  const user = useSession();

  const [open, setOpen] = useState(false);

  const handleLogOut = () => {
    signOut();
    setOpen(false);
  };

  const mappedLinkList = !user ? links : authorizedLinks;

  return (
    <header className="z-[997] relative">
      <motion.div
        className="
      z-[998] fixed top-0 left-1/2 
      h-[4.5rem] w-full rounded-none 
      border-white bg-white shadow-lg 
      shadow-black/[0.03] backdrop-blur-[0.5rem] 
      sm:top-6 sm:h-[3.25rem] sm:w-[36rem] 
      sm:rounded-full dark:bg-neutral-900"
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
      ></motion.div>
      <nav className="z-[999] flex fixed top-[0.15rem] left-1/2 h-12 -translate-x-1/2 sm:top-[1.7rem] sm:h-[initial] sm:py-0 w-[22rem] sm:w-[36rem] justify-center items-center">
        <ul className="flex w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium sm:w-[initial] sm:flex-nowrap sm:gap-5">
          {mappedLinkList.map((link) => (
            <motion.li
              className="h-3/4 flex items-center justify-center relative"
              key={link.hash}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Link
                className={clsx(
                  "flex w-full items-center justify-center px-3 py-3 hover:text-gray-950 transition dark:text-gray-300 dark:hover:text-gray-200",
                  {
                    "text-gray-950 dark:text-gray-200":
                      activeSection === link.name,
                  }
                )}
                href={link.hash}
                onClick={() => {
                  setActiveSection(link.name);
                  setTimeOfLastClick(Date.now());
                }}
              >
                {link.name}
                {link.name === activeSection && (
                  <motion.span
                    className="bg-gray-100 rounded-full 
                    absolute inset-0 -z-10 dark:bg-neutral-950"
                    layoutId="activeSection"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  ></motion.span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
        {user && (
          <motion.div
            className="absolute right-0 flex justify-center items-center h-12 px-5 cursor-pointer text-[0.9rem] font-medium sm:rounded-full text-red-500"
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
          className="z-[996] fixed top-[4.2rem] left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 rounded-full border-[0.5px] border-neutral-600 w-[22rem] h-10 sm:w-[26rem] justify-end items-center pt-2"
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

export default Navigation;
