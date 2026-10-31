"use client";

import { FC, useEffect, useState } from "react";
import { useDebounce, useLatest } from "@/shared/hooks";

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
  // The parent passes a new onRename on every render; only the typed name should trigger a save
  const onRenameRef = useLatest(onRename);

  useEffect(() => {
    if (debouncedNameValue.trim() && debouncedNameValue.trim() !== name) {
      onRenameRef.current(debouncedNameValue.trim());
    }
  }, [name, debouncedNameValue, onRenameRef]);

  return (
    <input
      value={nameValue}
      maxLength={500}
      onChange={(e) => setNameValue(e.target.value)}
      className="flex-1 min-w-0 border-0 outline-none bg-transparent wrap-break-word"
    />
  );
};
