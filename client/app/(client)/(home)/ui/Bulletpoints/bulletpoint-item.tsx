import { FC } from "react";
import { Title } from "@/shared/ui";
import { Bullet } from "./bullet";
import { IBulletpointData } from "./type";

interface BulletpointItemProps {
  data: IBulletpointData;
  reversed?: boolean;
}

export const BulletpointItem: FC<BulletpointItemProps> = ({
  data,
  reversed = false,
}) => {
  return (
    <div
      className={`group flex justify-between items-center gap-6 
        w-full
        pl-5 border-l-2 border-neutral-500/40 lg:pl-0 lg:border-l-0
        ${reversed ? "flex-row-reverse" : ""}`}
    >
      <div className="lg:flex hidden w-full flex-1 justify-center items-center">
        <Bullet>
          <span className="font-bold text-4xl">{data.id}</span>
        </Bullet>
      </div>

      <div className="flex-[2] w-full">
        <div
          className={`flex items-center gap-3 
            ${reversed ? "lg:justify-end" : "lg:justify-start"} justify-start`}
        >
          <span
            className="lg:hidden flex shrink-0 justify-center items-center
              w-9 h-9 rounded-full text-sm font-bold
              bg-gradient-to-br from-neutral-700 to-neutral-900 text-white
              shadow-md shadow-neutral-900/30"
          >
            {data.id}
          </span>
          <Title
            textStyles="lg:text-black text-neutral-100"
            text={data.title}
          />
        </div>
        <div
          className={`mt-2 lg:mt-0 ${reversed ? "lg:text-right" : "lg:text-left"} text-left`}
        >
          <p className="text-lg lg:text-black text-neutral-300 leading-relaxed">
            {data.text}
          </p>
        </div>
      </div>
    </div>
  );
};
