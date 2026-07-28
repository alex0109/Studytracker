import { FC, ReactNode } from "react";

interface BulletProps {
  children: ReactNode;
}

export const Bullet: FC<BulletProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center w-25 h-25 bg-neutral-900 border-sky-100 rounded-2xl text-white overflow-hidden">
      <div
        className="bg-[#c9c9c9] relative bottom-9 z-999 right-2 h-10 w-5 
          rounded-full blur-[2rem] sm:w-275 dark:bg-[#946263]"
      />
      {children}
      <div
        className="bg-[#000000] relative top-9 
          z-10 left-2 h-10 w-5 
          rounded-full blur-[0.5rem] sm:w-275 dark:bg-[#946263]"
      />
    </div>
  );
};
