import { ITag } from "@/entities/tag";
import { MaterialStatusEnum } from "./material-status.type";
import { MaterialTypeEnum } from "./material-type.type";
import { RichTextDocument } from "./rich-text-document.type";

export interface IMaterialResponse {
  id: string;
  title: string;
  type: MaterialTypeEnum;
  materialTags?: ITag[];
  link?: string;
  content?: RichTextDocument | undefined;
  status: MaterialStatusEnum;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
