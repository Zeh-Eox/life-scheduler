import { Module } from '@nestjs/common';
import { CategorieService } from './categorie.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CategorieController } from './categorie.controller.js';

@Module({
  providers: [CategorieService],
  imports: [PrismaModule],
  controllers: [CategorieController],
  exports: [CategorieService],
})
export class CategorieModule {}
