import { Check, Plus, X } from "lucide-react";
import { FC, useState } from "react";
import { getTextColor } from "@/shared/lib/get-text-color";

interface SyncTagProps {
  id: string;
  name: string;
  color: string;

  selected: boolean;

  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}

export const ManageTagItem: FC<SyncTagProps> = ({
  id,
  name,
  color,
  selected,
  onAdd,
  onRemove,
}) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{ backgroundColor: color, color: getTextColor(color) }}
      className="px-3
        rounded-2xl
        flex
        items-center
        gap-2
        whitespace-nowrap
        shrink-0
        cursor-pointer"
      onClick={() => (selected ? onRemove(id) : onAdd(id))}
    >
      <span
        className="transition-transform duration-200 hover:scale-150"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {!selected ? (
          <Plus size={16} />
        ) : hover ? (
          <X size={16} className="text-red-600" />
        ) : (
          <Check size={16} className="text-green-600" />
        )}
      </span>

      <span className="m-1">{name}</span>
    </div>
  );
};
