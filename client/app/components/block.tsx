import React from "react";

function Block({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className="p-8 my-3 bg-gray-100 dark:bg-neutral-800 
                    rounded-xl w-[1000px] h-[100%] border-3 
                    border-gray-50 dark:border-neutral-700 
                    flex flex-col items-center justify-between"
    >
      {children}
    </div>
  );
}

export default Block;
