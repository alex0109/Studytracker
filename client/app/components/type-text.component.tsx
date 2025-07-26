import React, { useState, useEffect } from "react";
import { TypeTextType } from "../types/type-text.types";

let timer: string | number | NodeJS.Timeout | undefined;

function TypeText({ text, typeSpeed }: TypeTextType) {
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
}

export default TypeText;
