"use client";

import { FC, useState } from "react";
import { useTranslation } from "@/shared/i18n";
import { colors } from "../../lib/colors";

interface Props {
  onChange?: (color: string) => void;
}

export const ColorPicker: FC<Props> = ({ onChange }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string>("#64748B");

  const handleSelect = (color: string) => {
    setSelected(color);
    onChange?.(color);
  };

  return (
    <div className="my-3 space-y-3">
      <p className="text-sm text-neutral-400">{t("tags.color")}</p>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) =>
          color.shades.map((shade) => (
            <button
              key={shade}
              type="button"
              onClick={() => handleSelect(shade)}
              aria-label={shade}
              aria-pressed={selected === shade}
              className={`w-8 h-8 rounded-full border-3 transition ${
                selected === shade
                  ? "border-neutral-600 scale-110 dark:border-neutral-200"
                  : "border-transparent"
              }`}
              style={{
                backgroundColor: shade,
              }}
            />
          )),
        )}
      </div>
    </div>
  );
};
