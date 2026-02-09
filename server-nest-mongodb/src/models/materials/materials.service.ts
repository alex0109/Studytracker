import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateMaterialDto } from './dto/create-materials.dto';
import { UpdateMaterialDto } from './dto/update-materials.dto';
import { IMaterials, IStatistics } from './interfaces/materials.interface';
import { MaterialsSchema } from './entities/materials.entity';

@Injectable()
export class MaterialsService {
  constructor(
    @Inject('MATERIALS_MODEL')
    private materialsModel: Model<IMaterials>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto) {
    const createdMaterial = new this.materialsModel(createMaterialDto);
    return createdMaterial.save();
  }

  async findAll() {
    return this.materialsModel.find().exec();
  }

  async findOne(id: string) {
    const getOneMaterial = await this.materialsModel.findById(id);

    if (!getOneMaterial) {
      throw new HttpException(
        `There is no such material with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      return getOneMaterial;
    }
  }

  async update(id: string, updateMaterialDto: UpdateMaterialDto) {
    const updatedMaterial = await this.materialsModel.findByIdAndUpdate(
      id,
      updateMaterialDto,
      { new: true },
    );

    return updatedMaterial;
  }

  async remove(id: string) {
    const deleteMaterial = await this.materialsModel
      .findByIdAndDelete(id)
      .exec();

    console.log(deleteMaterial);

    if (!deleteMaterial) {
      throw new HttpException(
        'Error occured while deleting material',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return { message: `Material with id ${id} was successfully deleted!` };
    }
  }

  async stats(): Promise<IStatistics> {
    const allMaterials = await this.materialsModel.find();
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
