import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AppareilService } from './appareil.service.js';
import { CreateAppareilDto } from './dto/create-appareil.dto.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@UseGuards(AccessTokenGuard)
@Controller('appareil')
export class AppareilController {
  constructor(private appareilService: AppareilService) {}

  @Post()
  register(@CurrentUser('sub') userId: string, @Body() dto: CreateAppareilDto) {
    return this.appareilService.register(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('sub') userId: string) {
    return this.appareilService.findAllForUser(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.appareilService.remove(id, userId);
  }
}
