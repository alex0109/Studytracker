// SHARED-UI

import { FC } from "react";
import { cn } from "@/shared/lib/cn.util";

interface TitleProps {
  text: string;
  blockStyles?: string;
  textStyles?: string;
}

export const Title: FC<TitleProps> = ({ text, blockStyles, textStyles }) => {
  return (
    <div className={cn(`my-3`, blockStyles)}>
      <h2 className={cn(`text-center font-bold text-[30px]`, textStyles)}>
        {text}
      </h2>
    </div>
  );
};
