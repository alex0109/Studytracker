import { FC, ReactNode } from "react";

interface BulletProps {
  children: ReactNode;
}

export const Bullet: FC<BulletProps> = ({ children }) => {
  return (
    <div
      className="relative flex justify-center items-center w-25 h-25
        bg-gradient-to-br from-neutral-900 to-neutral-700
        border border-white/10 rounded-2xl text-white overflow-hidden
        transition-transform duration-300 ease-out
        group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-sky-900/30"
    >
      <div
        className="bg-[#c9c9c9] absolute -top-4 -right-2 h-10 w-5
          rounded-full blur-[2rem] sm:w-275 dark:bg-[#946263]"
      />
      <span className="relative z-10">{children}</span>
      <div
        className="bg-[#000000] absolute -bottom-4 -left-2 h-10 w-5
          rounded-full blur-[0.5rem] sm:w-275 dark:bg-[#946263]"
      />
    </div>
  );
};
