import { Module } from '@nestjs/common';
import { EvenementService } from './evenement.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CategorieModule } from '../categorie/categorie.module.js';
import { EvenementController } from './evenement.controller.js';
import { RecurrenceCalculatorService } from './recurrence-calculator.service.js';

@Module({
  imports: [PrismaModule, CategorieModule],
  providers: [EvenementService, RecurrenceCalculatorService],
  controllers: [EvenementController],
  exports: [EvenementService, RecurrenceCalculatorService],
})
export class EvenementModule {}
