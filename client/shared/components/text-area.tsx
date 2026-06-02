import {
  ChangeEvent,
  forwardRef,
  Ref,
  TextareaHTMLAttributes,
  useState,
} from "react";

import { cn } from "@/shared/lib/utils";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  inputBlockStyles?: string;
  inputStyles?: string;
  maxLength?: number;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  ref?: Ref<HTMLTextAreaElement>;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    const {
      error,
      inputBlockStyles,
      inputStyles,
      onChange,
      disabled,
      maxLength,
      defaultValue,
      value,
      ...textareaProps
    } = props;

    const [textLength, setTextLength] = useState(
      String(value || defaultValue || "").length,
    );

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setTextLength(event.target.value.length);

      onChange?.(event);
    };

    return (
      <div className={cn("flex flex-col gap-1", inputBlockStyles)}>
        <textarea
          {...textareaProps}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          maxLength={maxLength}
          disabled={disabled}
          className={cn(
            `text-[15px] min-h-[50px] resize-none rounded-2xl outline-none`,
            disabled
              ? "bg-gray-200 dark:bg-neutral-500"
              : "bg-gray-100 dark:bg-neutral-700",
            inputStyles,
          )}
        />
        <div className="flex justify-between mb-5">
          <div className="px-5">
            {error && <p className="text-red-400">{error}</p>}
          </div>
          {maxLength && (
            <div className="flex justify-end">
              <p className="text-sm text-gray-500">
                {textLength}/{maxLength}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
