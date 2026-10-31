import { RichTextDocument } from "@/shared/types";
import { MaterialStatusEnum } from "./material-status.type";
import { MaterialTypeEnum } from "./material-type.type";

export interface IMaterialUpdate {
  title?: string;
  type?: MaterialTypeEnum;
  status?: MaterialStatusEnum;
  link?: string;
  content?: RichTextDocument;
}
