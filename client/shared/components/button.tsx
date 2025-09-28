import React, { FC } from "react";

interface CustomButtonProps {
  onClick?: () => void;
  title: string;
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  buttonStyles?: string;
}

const CustomButton: FC<CustomButtonProps> = ({
  onClick,
  title,
  disabled = false,
  type = "button",
  buttonStyles,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`w-full bg-neutral-800 border-2 border-neutral-700 p-2 rounded-xl text-white hover:opacity-90 cursor-pointer duration-200 ${
        buttonStyles || ""
      }`}
    >
      {title}
    </button>
  );
};

export default CustomButton;
