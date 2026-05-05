import { useEffect, useState } from "react";
import useDebounce from "../hooks/use-debounce.hook";
import { IMaterial } from "@/app/types/types";

interface EditableFieldProps<K extends keyof IMaterial> {
  initialValue: IMaterial[K] | undefined;
  titleHeading?: boolean;
  subtitleHeading?: boolean;
  textHeading?: boolean;
  maxLength?: number;
  onInput?: () => void;
}

function EditableField<K extends keyof IMaterial>({
  initialValue,
  titleHeading,
  subtitleHeading,
  textHeading,
  maxLength,
  onInput,
}: EditableFieldProps<K>) {
  const [value, setValue] = useState(initialValue);
  // const { updateMaterial } = useMaterialUpdate();

  // const debouncedText = useDebounce(value, 2000);

  // useEffect(() => {
  //   if (debouncedText) {
  //     updateMaterial({ id, dataToUpdate: { [field]: debouncedText } });
  //   }
  // }, [debouncedText]);

  return (
    <input
      className={`bg-transparent focus:outline-none ${
        titleHeading && " text-center text-2xl font-bold"
      } ${subtitleHeading && "border-none text-center text-xl font-medium"} ${
        textHeading && "w-full border-none font-medium"
      }`}
      value={String(value)}
      onChange={(e) => setValue(e.target.value as IMaterial[K])}
      maxLength={maxLength ? maxLength : undefined}
      onInput={onInput}
    />
  );
}

export default EditableField;
