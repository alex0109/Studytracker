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
      className={`my-3 flex flex-col gap-2 flex-wrap items-center justify-center ${
        blockStyles || ""
      }`}
    >
      {children}
    </div>
  );
};

export default ContainerColumn;
