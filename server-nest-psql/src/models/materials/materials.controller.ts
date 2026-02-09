import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialsDto } from './dto/materials.dto';
import type { TUpdateMaterialsDto } from './dto/materials.dto';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  async findAllMaterials() {
    return this.materialsService.findAll();
  }

  @Get(':id')
  async findOneMaterial(@Param('id') id: string) {
    return await this.materialsService.findOneMaterial(id);
  }

  @HttpCode(201)
  @Post()
  async createMaterial(@Body() dto: CreateMaterialsDto) {
    return await this.materialsService.createMaterial(dto);
  }

  @Delete(':id')
  async deleteMaterial(@Param('id') id: string) {
    return await this.materialsService.deleteMaterial(id);
  }

  @Patch(':id')
  async updateMaterial(@Param('id') dto: TUpdateMaterialsDto) {
    return await this.materialsService.updateMaterial(dto);
  }

  @Get('stats/data')
  async collectStatistics() {
    return await this.materialsService.collectStatistics();
  }
}
