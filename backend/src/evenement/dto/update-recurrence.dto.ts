import { PartialType } from '@nestjs/mapped-types';
import { CreateRecurrenceDto } from './create-recurrence.dto.js';

export class UpdateRecurrenceDto extends PartialType(CreateRecurrenceDto) {}
