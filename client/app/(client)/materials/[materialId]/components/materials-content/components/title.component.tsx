import { FC, useEffect, useState } from "react";
import { Input } from "@/shared/radix-ui/Input/input";
import { useDebounce } from "@/shared/hooks";

interface MaterialTitleType {
  id: string;
  title: string;
  updateTitleHandler: (id: string, title: string) => void;
}

const MaterialTitle: FC<MaterialTitleType> = ({
  id,
  title,
  updateTitleHandler,
}) => {
  const [titleValue, setTitleValue] = useState(title);

  const debouncedTitleValue = useDebounce(titleValue, 1500);

  useEffect(() => {
    if (title !== debouncedTitleValue) {
      updateTitleHandler(id, debouncedTitleValue);
    }
  }, [id, title, debouncedTitleValue]);

  const onUpdateTitle = (newTitle: string) => {
    setTitleValue(newTitle);
  };

  return (
    <Input
      className="focus:outline-none text-center text-2xl font-bold border-0"
      value={titleValue}
      onChange={(e) => onUpdateTitle(e.target.value)}
      maxLength={30}
    />
  );
};

export default MaterialTitle;
