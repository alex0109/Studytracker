import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialsDto } from './dto/materials.dto';
import type { TUpdateMaterialsDto } from './dto/materials.dto';
import { MaterialsGuard } from '../../common/guards/auth.guard';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @UseGuards(MaterialsGuard)
  @Get()
  async findAllMaterials() {
    return await this.materialsService.findAll();
  }

  @UseGuards(MaterialsGuard)
  @Get(':id')
  async findOneMaterial(@Param('id') id: string) {
    return await this.materialsService.findOneMaterial(id);
  }

  @UseGuards(MaterialsGuard)
  @HttpCode(201)
  @Post()
  createMaterial(@Body() dto: CreateMaterialsDto) {
    return this.materialsService.createMaterial(dto);
  }

  @UseGuards(MaterialsGuard)
  @Delete(':id')
  deleteMaterial(@Param('id') id: string) {
    return this.materialsService.deleteMaterial(id);
  }

  @UseGuards(MaterialsGuard)
  @Patch(':id')
  updateMaterial(@Param('id') id: string, @Body() dto: TUpdateMaterialsDto) {
    return this.materialsService.updateMaterial({ ...dto, id });
  }

  @UseGuards(MaterialsGuard)
  @Get('stats/data')
  async collectStatistics() {
    return await this.materialsService.collectStatistics();
  }
}
