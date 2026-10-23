"use client";

import { FC } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LuBookA, LuCircleHelp, LuNotebookPen, LuPencil } from "react-icons/lu";

const attachments = [
  { icon: LuNotebookPen, title: "Light reactions", meta: "text note" },
  { icon: LuPencil, title: "Chloroplast sketch", meta: "drawing note" },
  { icon: LuCircleHelp, title: "6 questions", meta: "open · options · true/false" },
  { icon: LuBookA, title: "Key terms", meta: "dictionary · 18 words" },
];

export const MaterialDemo: FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-3 border-gray-50 bg-gray-100 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-neutral-500">
              📄 article · created 12 Oct
            </span>
            <span className="text-xl font-bold text-neutral-900">
              Photosynthesis
            </span>
          </div>
          <span className="shrink-0 rounded-2xl bg-purple-500 px-3 py-1 text-xs text-white">
            In process
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-xl bg-sky-500 px-2 py-0.5 text-xs text-white">
            biology
          </span>
          <span className="rounded-xl bg-rose-500 px-2 py-0.5 text-xs text-white">
            exam
          </span>
        </div>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {attachments.map((item, index) => (
          <motion.li
            key={item.title}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.07 }}
            className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-3"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
              <item.icon />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium text-neutral-900">
                {item.title}
              </span>
              <span className="truncate text-xs text-neutral-500">
                {item.meta}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};
