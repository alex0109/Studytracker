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
        `my-3 flex flex-col gap-2 flex-wrap items-center justify-center`,
        blockStyles
      )}
    >
      {children}
    </div>
  );
};

export default ContainerColumn;
