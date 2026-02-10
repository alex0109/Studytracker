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
    const data = await this.prisma.material.findUnique({
      where: {
        id,
      },
    });

    console.log(data?.id);

    return data;
  }

  createMaterial(dto: CreateMaterialsDto) {
    console.log(dto);
    return this.prisma.material.create({ data: dto });
  }

  deleteMaterial(id: string) {
    return this.prisma.material.delete({ where: { id } });
  }

  updateMaterial(user: TUpdateMaterialsDto) {
    return this.prisma.material.update({
      data: user,
      where: { id: user.id },
    });
  }

  async collectStatistics() {
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
