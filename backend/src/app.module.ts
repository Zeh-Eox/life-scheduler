import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { CategorieModule } from './categorie/categorie.module.js';
import { EvenementModule } from './evenement/evenement.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notification/notification.module.js';
import { SchedulerModule } from './scheduler/scheduler.module.js';
import { AppareilModule } from './appareil/appareil.module.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    UserModule,
    AuthModule,
    CategorieModule,
    EvenementModule,
    NotificationModule,
    SchedulerModule,
    AppareilModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
