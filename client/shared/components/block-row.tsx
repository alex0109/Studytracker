import { FC, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface BlockRowProps {
  children: ReactNode;
  blockStyles?: string;
}

const BlockRow: FC<BlockRowProps> = ({ children, blockStyles }) => {
  return (
    <div
      className={cn(
        `p-8 my-3 bg-gray-100 dark:bg-neutral-800 
                    rounded-xl w-[1000px] h-full border-3 
                    border-gray-50 dark:border-neutral-700 
                    flex flex-row gap-2 flex-wrap items-center`,
        blockStyles
      )}
    >
      {children}
    </div>
  );
};

export default BlockRow;
