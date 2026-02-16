export class CreateMaterialDto {
  id!: string;
  title!: string;
  type!: string;
  tags?: string[];
  link?: string;
  description?: object;
  status!: string;
}
