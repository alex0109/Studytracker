"use client";

import { useState } from "react";

// A setting picked from a row of choices: none ("all questions", "no timer"), a preset, or a
// number of the user's own typed in
export const NONE = "none";
export const CUSTOM = "custom";

export const useNumberSetting = (saved: number | null, presets: readonly number[]) => {
  const isPreset = saved !== null && presets.includes(saved);

  const [choice, setChoice] = useState(saved === null ? NONE : isPreset ? String(saved) : CUSTOM);
  const [customText, setCustomText] = useState(saved === null || isPreset ? "" : String(saved));

  // NaN while the number typed in isn't one
  const value = choice === NONE ? null : choice === CUSTOM ? Number.parseInt(customText, 10) : Number(choice);

  return { choice, setChoice, customText, setCustomText, value };
};

export const isWholeInRange = (value: number | null, min: number, max: number) =>
  value === null || (Number.isInteger(value) && value >= min && value <= max);
