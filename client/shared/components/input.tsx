import React, { forwardRef } from "react";

interface InputProps {
  label?: string;
  error?: string;
  placeholder?: string;
}

const CustomInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { error, label, placeholder, ...inputProps } = props;

  return (
    <div className="flex gap-2 flex-col">
      {label && (
        <label className="flex border-l-1 border-black dark:border-white px-2">
          {label}&ensp;
          {error && <p className="text-red-400">{error}</p>}
        </label>
      )}
      <input
        {...inputProps}
        ref={ref}
        className="bg-gray-100 dark:bg-neutral-700 p-2 mt-2 mb-3 rounded-2xl"
        placeholder={placeholder}
      />
    </div>
  );
});

CustomInput.displayName = "CustomInput";

export default CustomInput;
