import { FC } from "react";
import Link from "next/link";
import { EmptyMaterialCarouselItem } from "./empty-material-list";
import { MaterialCarouselItem } from "./material-carousel-item";
import { routes } from "@/shared/config/routes";
import { CarouselProps, useLastOpened } from "@/entities/material";

export const MaterialCarousel: FC<CarouselProps> = ({ materials }) => {
  const { saveLastOpenedId } = useLastOpened();

  if (!materials || materials.length === 0) {
    return (
      <div className="w-full rounded-4xl">
        <EmptyMaterialCarouselItem />
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
          <MaterialCarouselItem
            assessmentId={item.assessmentId}
            title={item.title}
            type={item.type}
            materialTags={item.materialTags}
            status={item.status}
            link={item.link}
            id={item.id}
            createdAt={item.createdAt}
            updatedAt={item.updatedAt}
            isActive={item.isActive}
            version={item.version}
          />
        </Link>
      ))}
    </div>
  );
};
