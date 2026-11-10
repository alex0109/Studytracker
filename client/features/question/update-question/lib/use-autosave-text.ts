import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce, useLatest } from "@/shared/hooks";

interface AutosaveOptions {
  delay?: number;
  // A title can't be emptied; an answer or an explanation can
  allowEmpty?: boolean;
}

// A text that saves itself after a pause in typing and at once when the field is left
export const useAutosaveText = (
  initial: string,
  save: (value: string) => void,
  { delay = 1000, allowEmpty = true }: AutosaveOptions = {},
) => {
  const [value, setValue] = useState(initial);
  const lastSaved = useRef(initial);
  const saveRef = useLatest(save);

  const flush = useCallback(
    (next: string) => {
      if (next === lastSaved.current) return;
      if (!allowEmpty && !next.trim()) return;
      lastSaved.current = next;
      saveRef.current(next);
    },
    [allowEmpty, saveRef],
  );

  const debounced = useDebounce(value, delay);
  useEffect(() => {
    flush(debounced);
  }, [debounced, flush]);

  return { value, setValue, flush };
};
