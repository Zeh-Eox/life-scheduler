import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { CategorieService } from './categorie.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { CreateCategorieDto } from './dto/create-categorie.dto.js';
import { UpdateCategorieDto } from './dto/update-categorie.dto.js';

@UseGuards(AccessTokenGuard)
@Controller('categories')
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) {}

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateCategorieDto) {
    return this.categorieService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('sub') userId: string) {
    return this.categorieService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.categorieService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateCategorieDto,
  ) {
    return this.categorieService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.categorieService.remove(id, userId);
  }
}
