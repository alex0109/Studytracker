import { FC, ReactNode } from "react";

interface BlockColumnProps {
  children: ReactNode;
  blockStyles?: string;
}

const BlockColumn: FC<BlockColumnProps> = ({ children, blockStyles }) => {
  return (
    <div
      className={`p-8 my-3 bg-gray-100 dark:bg-neutral-800 
                    rounded-xl min-w-[360px] lg:w-[1000px] md:w-[600px] sm:w-full  h-full border-3 
                    border-gray-50 dark:border-neutral-700 
                    flex flex-col gap-1 flex-wrap items-center ${
                      blockStyles || ""
                    }`}
    >
      {children}
    </div>
  );
};

export default BlockColumn;
