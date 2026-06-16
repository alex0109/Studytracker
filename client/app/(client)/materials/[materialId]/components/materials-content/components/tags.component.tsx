import { Button } from "@/shared/components/ui/button";
import React, { FC, useState } from "react";
import { LuX } from "react-icons/lu";

interface MaterialTagsType {
  id: string;
  materialTags: string[] | undefined;
  updateTagsHandler: (id: string, tags: string[]) => void;
}

const MaterialTags: FC<MaterialTagsType> = ({
  id,
  materialTags,
  updateTagsHandler,
}) => {
  const ENTER = "Enter";
  const COMMA = ",";

  const [tags, setTags] = useState<string[]>(materialTags || []);
  const [tagValue, setTagValue] = useState("");

  const handleDeleteTag = (id: string, tag: string) => {
    if (materialTags && materialTags?.length > 0) {
      setTags((tags) => tags?.filter((item) => item !== tag));
      updateTagsHandler(
        id,
        materialTags.filter((item) => item !== tag),
      );
    }
  };

  const addTagEnter = () => {
    const tag = tagValue.trim();
    if (!tag) return;
    const newTags = [...(tags ?? []), tag];
    updateTagsHandler(id, newTags);
    setTags(newTags);
    setTagValue("");
  };

  const addTagComma = () => {
    const tag = tagValue.trim().slice(0, -1);
    if (!tag) return;
    const newTags = [...(tags ?? []), tag];
    updateTagsHandler(id, newTags);
    setTags(newTags);
    setTagValue("");
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (key === COMMA) {
      addTagComma();
    }
    if (key === ENTER) {
      addTagEnter();
    }
  };

  return (
    <div>
      <span className="italic">Tags</span>
      <div className="flex flex-col flex-wrap gap-2">
        <div>
          <input
            type="text"
            value={tagValue}
            placeholder="Tag..."
            onChange={(e) => setTagValue(e.target.value)}
            onKeyUp={handleKeyUp}
            className="text-[15px] px-4 py-2 my-2 rounded-2xl bg-neutral-200 dark:bg-neutral-700"
          />
        </div>
        <div className="flex flex-row gap-2">
          {!tags || tags.length == 0 ? (
            <p>No tags</p>
          ) : (
            tags?.map((tag, i) => (
              <Button
                key={i}
                className="bg-blue-200 text-blue-800 px-2 py-1 rounded hover:bg-blue-100"
                onClick={() => handleDeleteTag(id, tag)}
              >
                <LuX />
                {tag}
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialTags;
