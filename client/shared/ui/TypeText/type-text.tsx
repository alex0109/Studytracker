"use client";

import { useState, useEffect, FC } from "react";
import { ITypeText } from "./type-text.type";

export const TypeText: FC<ITypeText> = ({ text, typeSpeed }) => {
  const [typedCount, setTypedCount] = useState(0);

  // One more letter per tick until the whole text is shown
  useEffect(() => {
    if (typedCount >= text.length) return;

    const timer = setTimeout(
      () => setTypedCount((count) => count + 1),
      1000 / typeSpeed,
    );
    return () => clearTimeout(timer);
  }, [typedCount, text.length, typeSpeed]);

  return (
    <p className="text-xl text-center">
      {text.slice(0, typedCount)}{" "}
      <span className="cursor border-black dark:border-white" />
    </p>
  );
};
