import { useState } from "react";
import debounce from "lodash.debounce";
import useMaterials from "@/app/materials/hooks/useMaterials.hook";
import { Material } from "@/app/materials/services/type";

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

  const saveDebounced = debounce((val: Material[K]) => {
    updateMaterial({ id, dataToUpdate: { [field]: val } });
  }, 800);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value as Material[K];
    setValue(val);
    saveDebounced(val);
  };

  return (
    <input
      className={`bg-transparent focus:outline-none ${
        titleHeading &&
        "border-b-1 border-b-neutral-300 text-center text-2xl font-bold"
      } ${subtitleHeading && "border-none text-center text-xl font-medium"} ${
        textHeading && "w-full border-none font-medium"
      }`}
      value={value}
      onChange={handleChange}
    />
  );
}

export default EditableField;
