import { Injectable } from '@nestjs/common';
import { Material } from 'src/generated/prisma/client';
import { PrismaService } from 'src/providers/database/prisma.service';
import { CreateMaterialsDto, TUpdateMaterialsDto } from './dto/materials.dto';
import { IStatistics } from './interfaces/stats.interface';

@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.material.findMany();
  }

  async findOneMaterial(id: string) {
    return await this.prisma.material.findUnique({
      where: {
        id,
      },
    });
  }

  async createMaterial(dto: CreateMaterialsDto) {
    console.log(dto);
    return await this.prisma.material.create({ data: dto });
  }

  async deleteMaterial(id: string) {
    return await this.prisma.material.delete({ where: { id } });
  }

  async updateMaterial(dto: TUpdateMaterialsDto) {
    return await this.prisma.material.update({
      data: dto,
      where: { id: dto.id },
    });
  }

  async collectStatistics(): Promise<IStatistics> {
    const allMaterials = await this.prisma.material.findMany();
    const types = {};
    const statuses = {};

    for (let i = 0; i < allMaterials.length; i++) {
      if (!Object.keys(types).includes(allMaterials[i].type)) {
        types[allMaterials[i].type] = 1;
      } else {
        types[allMaterials[i].type] += 1;
      }

      if (!Object.keys(statuses).includes(allMaterials[i].status)) {
        statuses[allMaterials[i].status] = 1;
      } else {
        statuses[allMaterials[i].status] += 1;
      }
    }

    return { count: allMaterials.length, types, statuses };
  }
}
