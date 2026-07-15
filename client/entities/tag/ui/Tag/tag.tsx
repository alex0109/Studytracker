import { getTextColor } from "@/shared/lib/get-text-color";
import { FC } from "react";

interface TagProps {
  id: string;
  color: string;
  name: string;
}

export const Tag: FC<TagProps> = ({ id, color, name }) => {
  return (
    <div
      style={{ backgroundColor: color, color: getTextColor(color) }}
      className="h-8
        px-3
        rounded-2xl
        flex
        items-center
        gap-2
        whitespace-nowrap
        shrink-0"
    >
      <span>{name}</span>
    </div>
  );
};
