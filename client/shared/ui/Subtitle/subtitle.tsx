// SHARED-UI

import { FC } from "react";
import { cn } from "@/shared/lib/cn";

interface SubtitleProps {
  text: string;
  blockStyles?: string;
  textStyles?: string;
}

export const Subtitle: FC<SubtitleProps> = ({
  text,
  blockStyles,
  textStyles,
}) => {
  return (
    <div className={cn(`my-2`, blockStyles)}>
      <h3 className={cn(`text-black dark:text-white text-center`, textStyles)}>
        {text}
      </h3>
    </div>
  );
};
