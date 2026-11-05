import { Check, Plus, X } from "lucide-react";
import { FC, useState } from "react";
import { getTextColor } from "@/shared/lib/get-text-color";
import { DeleteTagButton } from "@/features/tag/delete-tag";

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

  // Two actions on one chip: the name puts the tag on the material or takes it off,
  // the bin deletes the tag itself
  return (
    <div
      style={{ backgroundColor: color, color: getTextColor(color) }}
      className="flex shrink-0 items-center rounded-2xl pr-1.5 whitespace-nowrap"
    >
      <button
        type="button"
        aria-pressed={selected}
        className="flex items-center gap-2 py-1 pl-3 pr-1"
        onClick={() => (selected ? onRemove(id) : onAdd(id))}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span className="transition-transform duration-200">
          {!selected ? (
            <Plus size={16} />
          ) : hover ? (
            <X size={16} className="text-red-600" />
          ) : (
            <Check size={16} className="text-green-600" />
          )}
        </span>
        <span>{name}</span>
      </button>
      <span aria-hidden className="mx-0.5 h-4 w-px bg-current opacity-25" />
      <DeleteTagButton id={id} name={name} />
    </div>
  );
};
