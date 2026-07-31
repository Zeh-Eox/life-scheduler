import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NotificationModule } from '../notification/notification.module.js';
import { EvenementModule } from '../evenement/evenement.module.js';

@Module({
  imports: [PrismaModule, NotificationModule, EvenementModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
