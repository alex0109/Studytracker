import { FC, useState } from "react";
import useMaterials from "@/app/materials/hooks/useMaterials.hook";
import { LuSquarePen } from "react-icons/lu";

type EditableLinkProps = {
  id: number;
  initialValue: string;
};

const EditableLink: FC<EditableLinkProps> = ({ id, initialValue = "" }) => {
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);

  const { updateMaterial } = useMaterials();

  const handleBlur = () => {
    setEditing(false);
    if (value !== initialValue) {
      updateMaterial({ id, dataToUpdate: { link: value } });
    }
  };

  if (editing) {
    return (
      <input
        className="bg-neutral-200 dark:bg-neutral-700 rounded border-none w-full px-2 focus:outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        autoFocus
      />
    );
  }

  return (
    <div
      className="flex items-center px-2 rounded w-full bg-transparent cursor-pointer hover:bg-neutral-200 duration-200"
      onClick={() => setEditing(true)}
    >
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="underline cursor-pointer pr-2"
      >
        Source link
      </a>
      <LuSquarePen />
    </div>
  );
};

export default EditableLink;
