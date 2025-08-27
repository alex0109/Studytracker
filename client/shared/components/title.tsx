import { FC } from "react";

interface TitleProps {
  text: string;
  blockStyles?: string;
  textStyles?: string;
}

const Title: FC<TitleProps> = ({ text, blockStyles, textStyles }) => {
  return (
    <div className={`my-3 ${blockStyles || ""}`}>
      <h2 className={`text-center font-bold ${textStyles || ""}`}>{text}</h2>
    </div>
  );
};

export default Title;
