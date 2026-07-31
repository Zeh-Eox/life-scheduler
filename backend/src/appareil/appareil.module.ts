import { Module } from '@nestjs/common';
import { AppareilService } from './appareil.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AppareilController } from './appareil.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [AppareilController],
  providers: [AppareilService],
  exports: [AppareilService],
})
export class AppareilModule {}
