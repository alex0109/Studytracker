import { IMaterialResponse } from "./material-response.type";

export interface CarouselProps {
  materials: IMaterialResponse[];
  materialsIsPending: boolean;
}
