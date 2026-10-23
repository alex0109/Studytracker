"use client";

import { FC, useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks";

interface OptionNameInputProps {
  name: string;
  onRename: (name: string) => void;
}

export const OptionNameInput: FC<OptionNameInputProps> = ({
  name,
  onRename,
}) => {
  const [nameValue, setNameValue] = useState(name);

  const debouncedNameValue = useDebounce(nameValue, 1500);

  useEffect(() => {
    if (debouncedNameValue.trim() && debouncedNameValue.trim() !== name) {
      onRename(debouncedNameValue.trim());
    }
  }, [name, debouncedNameValue]);

  return (
    <input
      value={nameValue}
      maxLength={500}
      onChange={(e) => setNameValue(e.target.value)}
      className="flex-1 min-w-0 border-0 outline-none bg-transparent wrap-break-word"
    />
  );
};
