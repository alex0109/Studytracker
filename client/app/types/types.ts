import { RichTextDocument } from "../materials/services/type";

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

export interface ServerStatsDataType {
  count: number;
  types: {
    summary?: number;
    video?: number;
    article?: number;
    practice?: number;
    test?: number;
  };
  statuses: { tolearn?: number; inprocess?: number; finished?: number };
}
