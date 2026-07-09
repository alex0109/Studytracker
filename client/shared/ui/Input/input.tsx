// SHARED-UI

import { ChangeEvent, forwardRef, Ref } from "react";
import { cn } from "@/shared/lib/cn.util";

interface CustomInputProps {
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
  disabled?: boolean;
  maxLength?: number;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (props, ref) => {
    const {
      error,
      placeholder,
      inputBlockStyles,
      inputStyles,
      onChange,
      defaultValue,
      required,
      disabled,
      maxLength,
      ...inputProps
    } = props;

    return (
      <div className={cn(`flex gap-2 flex-col`, inputBlockStyles)}>
        <input
          onChange={onChange ? onChange : () => {}}
          {...inputProps}
          ref={ref}
          className={cn(
            `text-[15px] ${
              disabled
                ? "bg-gray-200 dark:bg-neutral-500"
                : "bg-gray-100 dark:bg-neutral-700"
            } px-4 py-2 my-2 rounded-2xl`,
            inputStyles,
          )}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
        />
        <div className="flex px-5 mb-5">
          {error && <p className="text-red-400">{error}</p>}
        </div>
      </div>
    );
  },
);

CustomInput.displayName = "CustomInput";
