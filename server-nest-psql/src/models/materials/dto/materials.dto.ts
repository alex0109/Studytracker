import { IsString, IsArray, IsJSON, IsOptional } from 'class-validator';
import { Prisma } from '../../../generated/prisma/client';

export class CreateMaterialsDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  link?: string;

  @IsString()
  type!: string;

  @IsOptional()
  @IsJSON()
  description?: Prisma.InputJsonValue;

  @IsString()
  status!: string;
}

export type TUpdateMaterialsDto = Partial<CreateMaterialsDto> & {
  id: string;
};
