import { useEffect, useState } from "react";
import useMaterials from "@/app/materials/hooks/useMaterials.hook";
import { Material } from "@/app/materials/services/type";
import useDebounce from "../hooks/use-debounce.hook";

interface EditableFieldProps<K extends keyof Material> {
  id: number;
  field: K;
  initialValue: Material[K];
  titleHeading?: boolean;
  subtitleHeading?: boolean;
  textHeading?: boolean;
}

function EditableField<K extends keyof Material>({
  id,
  field,
  initialValue,
  titleHeading,
  subtitleHeading,
  textHeading,
}: EditableFieldProps<K>) {
  const [value, setValue] = useState(initialValue);
  const { updateMaterial } = useMaterials();

  const debouncedText = useDebounce(value, 2000);

  useEffect(() => {
    if (debouncedText) {
      updateMaterial({ id, dataToUpdate: { [field]: debouncedText } });
    }
  }, [debouncedText]);

  return (
    <input
      className={`bg-transparent focus:outline-none ${
        titleHeading &&
        "border-b-1 border-b-neutral-300 text-center text-2xl font-bold"
      } ${subtitleHeading && "border-none text-center text-xl font-medium"} ${
        textHeading && "w-full border-none font-medium"
      }`}
      value={String(value)}
      onChange={(e) => setValue(e.target.value as Material[K])}
    />
  );
}

export default EditableField;
