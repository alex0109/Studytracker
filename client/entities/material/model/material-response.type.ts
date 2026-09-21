import { ITagResponse } from "@/entities/tag";
import { MaterialStatusEnum } from "./material-status.type";
import { MaterialTypeEnum } from "./material-type.type";
import { RichTextDocument } from "./rich-text-document.type";
import { INoteResponse } from "@/entities/note/model";

export interface IMaterialResponse {
  id: string;
  assessmentId: string;
  title: string;
  type: MaterialTypeEnum;
  materialTags?: ITagResponse[];
  notes?: INoteResponse[];
  link?: string;
  content?: RichTextDocument | undefined;
  status: MaterialStatusEnum;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
