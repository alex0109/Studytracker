import { FC } from "react";

interface TitleProps {
  text: string;
  blockStyles?: string;
  textStyles?: string;
}

const Title: FC<TitleProps> = ({ text, blockStyles, textStyles }) => {
  return (
    <div className={`my-3 ${blockStyles || ""}`}>
      <h1 className={`text-center text-2xl font-bold ${textStyles || ""}`}>
        {text}
      </h1>
    </div>
  );
};

export default Title;
