import React, { FC } from "react";

interface CustomButtonProps {
  onClick?: () => void;
  title: string;
  disabled?: boolean;
  type: "button" | "reset" | "submit";
}

function CustomButton({
  onClick,
  title,
  disabled = false,
  type,
}: CustomButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className="w-full bg-neutral-700 border-2 border-neutral-800 p-2 rounded-xl text-white hover:opacity-90 cursor-pointer duration-200"
    >
      {title}
    </button>
  );
}

export default CustomButton;
