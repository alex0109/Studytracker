import React, { useState, useEffect, FC } from "react";
import { TypeTextType } from "./types";

let timer: string | number | NodeJS.Timeout | undefined;

const TypeText: FC<TypeTextType> = ({ text, typeSpeed }) => {
  const [state, setState] = useState({
    typedText: "",
    currentIndex: 0,
  });

  function type() {
    timer = setTimeout(() => {
      if (state.currentIndex < text.length) {
        const currentText = text[state.currentIndex];
        setState({
          typedText: state.typedText + currentText,
          currentIndex: state.currentIndex + 1,
        });
        type();
      }
    }, 1000 / typeSpeed);
  }

  useEffect(() => {
    type();

    return () => clearTimeout(timer);
  }, [state.currentIndex]);

  return (
    <p>
      {state.typedText}{" "}
      <span className="cursor border-l-1 border-black dark:border-white" />
    </p>
  );
};

export default TypeText;
