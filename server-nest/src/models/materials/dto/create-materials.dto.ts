export class CreateMaterialDto {
  title: string;
  type: string;
  tags?: string[];
  link?: string;
  description?: object;
  status: string;
}
