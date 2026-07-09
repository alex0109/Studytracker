// SHARED-UI

import { FC } from "react";
import { cn } from "@/shared/lib/cn.util";

interface TextProps {
  text: string;
  textStyles?: string;
}

export const Text: FC<TextProps> = ({ text, textStyles }) => {
  return <p className={cn(`text-black dark:text-white`, textStyles)}>{text}</p>;
};
