import { FC } from "react";
import { useTagDelete } from "../../hooks/useTagDelete";
import { getTextColor } from "@/shared/lib/get-text-color";

interface TagProps {
  id: string;
  color: string;
  name: string;
}

export const DeleteTagItem: FC<TagProps> = ({ id, color, name }) => {
  const { deleteTag } = useTagDelete(id);

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
      <span
        onClick={() => deleteTag()}
        className="m-1 cursor-pointer hover:text-red-500"
      >
        &#10005;
      </span>
      <span>{name}</span>
    </div>
  );
};
