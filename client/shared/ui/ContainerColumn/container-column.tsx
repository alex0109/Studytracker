// SHARED-UI

import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib/cn.util";

interface ContainerColumnProps {
  children: ReactNode;
  blockStyles?: string;
}

export const ContainerColumn: FC<ContainerColumnProps> = ({
  children,
  blockStyles,
}) => {
  return (
    <div
      className={cn(
        `flex flex-col gap-2 flex-wrap my-5 min-w-[360px] lg:w-[900px] md:w-[600px] sm:w-full rounded-xl h-full`,
        blockStyles,
      )}
    >
      {children}
    </div>
  );
};
