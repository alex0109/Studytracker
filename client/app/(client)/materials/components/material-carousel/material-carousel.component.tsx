import React, { FC } from "react";

import EmptyMaterialItem from "./empty-material-list.component";
import MaterialItem from "./material-carousel-item.component";
import Link from "next/link";
import { routes } from "@/shared/lib/routes";
import { CarouselProps } from "@/app/types/types";
import useLastOpened from "@/shared/hooks/use-last-opened.hook";

const Carousel: FC<CarouselProps> = ({ materials }) => {
  const { saveLastOpenedId } = useLastOpened();

  if (!materials || materials.length === 0) {
    return (
      <div className="w-full rounded-4xl">
        <EmptyMaterialItem />
      </div>
    );
  }
  return (
    <div className="w-full overflow-x-scroll scroll-smooth whitespace-nowrap rounded-4xl">
      {materials.map((item) => (
        <Link
          key={item.id}
          href={`${routes.materials}/${item.id}`}
          onClick={() => saveLastOpenedId(item.id)}
        >
          <MaterialItem
            title={item.title}
            type={item.type}
            tags={item.tags}
            status={item.status}
            link={item.link}
            id={item.id}
            created_at={item.created_at}
          />
        </Link>
      ))}
    </div>
  );
};

export default Carousel;
