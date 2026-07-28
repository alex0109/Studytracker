import { bulletpoints } from "./data";
import { BulletpointItem } from "./bulletpoint-item";

export const Bulletpoints = () => {
  return (
    <div className="flex justify-center items-center w-full h-full lg:bg-neutral-100 bg-neutral-900 p-2 mb-5">
      <div className="relative flex flex-col lg:w-[60%] w-full gap-10 p-5 justify-center items-center">
        {bulletpoints.map((item, index) => (
          <BulletpointItem
            key={item.id}
            data={item}
            reversed={index % 2 !== 0}
          />
        ))}
      </div>
    </div>
  );
};
