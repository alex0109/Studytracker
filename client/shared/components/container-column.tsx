import { FC, ReactNode } from "react";

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
      className={`p-8 my-3 w-full h-full flex flex-col gap-2 flex-wrap items-center ${
        blockStyles || ""
      }`}
    >
      {children}
    </div>
  );
};

export default ContainerColumn;
