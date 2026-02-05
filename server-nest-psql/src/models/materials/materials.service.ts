import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/database/prisma.service';

@Injectable()
export class MaterialsService {
    constructor(private readonly prisma:PrismaService){}

    findAll() {
        return this.prisma.material.findMany()
    }
}
