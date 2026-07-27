import React, { FC } from "react";
import { MaterialTypeEnum } from "../..";

interface TypeBadgeProps {
  type: MaterialTypeEnum | undefined;
}

const TypeBadge: FC<TypeBadgeProps> = ({ type }) => {
  return (
    <span>
      {type === "article"
        ? "📄"
        : type === "video"
          ? "▶️"
          : type === "summary"
            ? "📚"
            : type === "practice"
              ? "📝"
              : type === "test"
                ? "✏️"
                : "❓"}
    </span>
  );
};

export default TypeBadge;
