import { FC } from "react";
import { cn } from "@/shared/lib/utils";

interface TitleProps {
  text: string;
  blockStyles?: string;
  textStyles?: string;
}

const Title: FC<TitleProps> = ({ text, blockStyles, textStyles }) => {
  return (
    <div className={cn(`my-3`, blockStyles)}>
      <h2 className={cn(`text-center font-bold`, textStyles)}>{text}</h2>
    </div>
  );
};

export default Title;
