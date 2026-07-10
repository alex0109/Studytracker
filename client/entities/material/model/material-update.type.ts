import { MaterialStatusEnum } from "./material-status.type";
import { MaterialTypeEnum } from "./material-type.type";
import { RichTextDocument } from "./rich-text-document.type";

export interface IMaterialUpdate {
  title?: string;
  type?: MaterialTypeEnum;
  status?: MaterialStatusEnum;
  link?: string;
  content?: RichTextDocument;
}
