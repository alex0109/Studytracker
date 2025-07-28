import React, { FC } from "react";

interface TextProps {
  text: string;
  textStyles?: string;
}

const Text: FC<TextProps> = ({ text, textStyles }) => {
  return (
    <p className={`text-black dark:text-white ${textStyles || ""}`}>{text}</p>
  );
};

export default Text;
