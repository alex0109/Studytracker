import React, { FC } from "react";

interface SubtitleProps {
  text: string;
  blockStyles?: string;
  textStyles?: string;
}

const Subtitle: FC<SubtitleProps> = ({ text, blockStyles, textStyles }) => {
  return (
    <div className={`my-2 ${blockStyles || ""}`}>
      <h3
        className={`text-black dark:text-white text-center ${textStyles || ""}`}
      >
        {text}
      </h3>
    </div>
  );
};

export default Subtitle;
