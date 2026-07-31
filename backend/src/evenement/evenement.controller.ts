import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { EvenementService } from './evenement.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { CreateEvenementDto } from './dto/create-evenement.dto.js';
import { UpdateEvenementDto } from './dto/update-evenement.dto.js';
import { UpdateRecurrenceDto } from './dto/update-recurrence.dto.js';

@UseGuards(AccessTokenGuard)
@Controller('evenements')
export class EvenementController {
  constructor(private readonly evenementService: EvenementService) {}

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateEvenementDto) {
    return this.evenementService.create(userId, dto);
  }

  @Get()
  findAll(
    @CurrentUser('sub') userId: string,
    @Query('categorieId') categorieId?: string,
  ) {
    return this.evenementService.findAllForUser(userId, categorieId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.evenementService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateEvenementDto,
  ) {
    return this.evenementService.update(id, userId, dto);
  }

  @Patch(':id/recurrence')
  updateRecurrence(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateRecurrenceDto,
  ) {
    return this.evenementService.updateRecurrence(id, userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.evenementService.remove(id, userId);
  }
}
