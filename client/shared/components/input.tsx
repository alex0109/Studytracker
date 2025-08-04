import React, { ChangeEvent, forwardRef, Ref } from "react";

interface InputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  inputBlockStyles?: string;
  inputStyles?: string;
  onChange?: (...event: ChangeEvent<HTMLInputElement>[]) => void;
  onBlur?: (...event: ChangeEvent<HTMLInputElement>[]) => void;
  name?: string;
  ref?: Ref<HTMLInputElement>;
}

const CustomInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    error,
    label,
    placeholder,
    inputBlockStyles,
    inputStyles,
    onChange,
    ...inputProps
  } = props;

  return (
    <div
      className={`flex gap-2 flex-col ${
        inputBlockStyles ? inputBlockStyles : ""
      }`}
    >
      {label && (
        <label className="flex border-l-1 border-black dark:border-white px-2">
          {label}&ensp;
          {error && <p className="text-red-400">{error}</p>}
        </label>
      )}
      <input
        onChange={onChange ? onChange : () => {}}
        {...inputProps}
        ref={ref}
        className={`bg-gray-100 dark:bg-neutral-700 p-2 mt-2 mb-3 rounded-2xl ${
          inputStyles ? inputStyles : ""
        }`}
        placeholder={placeholder}
      />
    </div>
  );
});

CustomInput.displayName = "CustomInput";

export default CustomInput;
