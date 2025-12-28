import React, { FC } from "react";
import { cn } from "@/shared/lib/utils";

interface TextProps {
  text: string;
  textStyles?: string;
}

const Text: FC<TextProps> = ({ text, textStyles }) => {
  return <p className={cn(`text-black dark:text-white`, textStyles)}>{text}</p>;
};

export default Text;
