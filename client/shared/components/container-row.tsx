import { FC, ReactNode } from "react";

interface ContainerRowProps {
  children: ReactNode;
  blockStyles?: string;
}

const ContainerRow: FC<ContainerRowProps> = ({ children, blockStyles }) => {
  return (
    <div
      className={`flex flex-row gap-2 flex-wrap items-center ${
        blockStyles || ""
      }`}
    >
      {children}
    </div>
  );
};

export default ContainerRow;
