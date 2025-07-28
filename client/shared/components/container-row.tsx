import { FC, ReactNode } from "react";

interface ContainerRowProps {
  children: ReactNode;
  blockStyles?: string;
}

const ContainerRow: FC<ContainerRowProps> = ({ children, blockStyles }) => {
  return (
    <div
      className={`p-8 my-3 w-full h-full flex flex-row gap-2 flex-wrap items-center justify-around ${
        blockStyles || ""
      }`}
    >
      {children}
    </div>
  );
};

export default ContainerRow;
