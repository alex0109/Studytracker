import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface ContainerColumnProps {
  children: ReactNode;
  blockStyles?: string;
}

const ContainerColumn: FC<ContainerColumnProps> = ({
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

export default ContainerColumn;
