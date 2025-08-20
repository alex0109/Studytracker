import React, { FC } from "react";

interface SubtitleProps {
  text: string;
  blockStyles?: string;
  textStyles?: string;
}

const Subtitle: FC<SubtitleProps> = ({ text, blockStyles, textStyles }) => {
  return (
    <div className={`my-2 ${blockStyles || ""}`}>
      <h1
        className={`text-black dark:text-white text-center text-lg ${
          textStyles || ""
        }`}
      >
        {text}
      </h1>
    </div>
  );
};

export default Subtitle;
