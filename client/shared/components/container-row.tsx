import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface ContainerRowProps {
  children: ReactNode;
  blockStyles?: string;
}

const ContainerRow: FC<ContainerRowProps> = ({ children, blockStyles }) => {
  return (
    <div
      className={cn(
        `flex flex-row gap-2 flex-wrap my-5 min-w-[360px] lg:w-[900px] md:w-[600px] sm:w-full rounded-xl h-full`,
        blockStyles,
      )}
    >
      {children}
    </div>
  );
};

export default ContainerRow;
