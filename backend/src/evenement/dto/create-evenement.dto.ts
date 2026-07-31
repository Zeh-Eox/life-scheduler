import { IsString, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRecurrenceDto } from './create-recurrence.dto.js';

export class CreateEvenementDto {
  @IsString()
  titre!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  categorieId!: string;

  @ValidateNested()
  @Type(() => CreateRecurrenceDto)
  recurrence!: CreateRecurrenceDto;
}
