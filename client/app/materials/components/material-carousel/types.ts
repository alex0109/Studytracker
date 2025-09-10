import { RichTextDocument } from "../../services/type";

export interface MaterialType {
  id: number;
  title: string;
  type?: "article" | "video" | "summary" | "practice" | "test";
  tag?: string;
  link?: string;
  description?: RichTextDocument | undefined;
  status?: "tolearn" | "inprocess" | "finished";
}

export interface CarouselProps {
  materials: MaterialType[];
  materialsLoading: boolean;
}
