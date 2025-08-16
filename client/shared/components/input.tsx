import React, { ChangeEvent, forwardRef, Ref } from "react";
import ContainerRow from "./container-row";

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
  defaultValue?: string;
  required?: boolean;
}

const CustomInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    error,
    label,
    placeholder,
    inputBlockStyles,
    inputStyles,
    onChange,
    defaultValue,
    required,
    ...inputProps
  } = props;

  return (
    <div
      className={`flex gap-2 flex-col ${
        inputBlockStyles ? inputBlockStyles : ""
      }`}
    >
      <ContainerRow>
        {label && (
          <label className="flex border-l-1 border-black dark:border-white px-2">
            {label}&ensp;
          </label>
        )}
        {error && <p className="text-red-400">{error}</p>}
      </ContainerRow>
      <input
        onChange={onChange ? onChange : () => {}}
        {...inputProps}
        ref={ref}
        className={`text-[15px] bg-gray-100 dark:bg-neutral-700 px-4 py-2 my-2 rounded-2xl ${
          inputStyles ? inputStyles : ""
        }`}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
      />
    </div>
  );
});

CustomInput.displayName = "CustomInput";

export default CustomInput;
