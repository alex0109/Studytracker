import React, { forwardRef } from "react";

interface InputProps {
  label?: string;
  error?: string;
  placeholder?: string;
}

export const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { error, label, placeholder, ...inputProps } = props;

    return (
      <div className="flex gap-2 flex-col">
        {label && (
          <label className="border-l-1 border-black dark:border-white px-2">
            {label}
          </label>
        )}
        <input
          {...inputProps}
          ref={ref}
          className="bg-gray-50 dark:bg-neutral-700 p-2 mt-2 mb-3 rounded-2xl"
          placeholder={placeholder}
        />
        {error && <p>Error: {error}</p>}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";
