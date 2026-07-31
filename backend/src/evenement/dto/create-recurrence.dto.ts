import {
  IsEnum,
  IsOptional,
  IsInt,
  IsString,
  Min,
  ValidateIf,
  Matches,
} from 'class-validator';
import { Frequence, JourSemaine, TypeRecurrence, UniteTemps } from '../../../generated/prisma/enums.js';

export class CreateRecurrenceDto {
  @IsEnum(TypeRecurrence)
  type!: TypeRecurrence;

  // --- Champs utilisés si type = PRECISE ---
  @ValidateIf((o) => o.type === TypeRecurrence.PRECISE)
  @IsEnum(Frequence)
  frequence?: Frequence;

  @ValidateIf(
    (o) =>
      o.type === TypeRecurrence.PRECISE &&
      o.frequence === Frequence.HEBDOMADAIRE,
  )
  @IsEnum(JourSemaine)
  jourSemaine?: JourSemaine;

  @ValidateIf(
    (o) =>
      o.type === TypeRecurrence.PRECISE && o.frequence === Frequence.MENSUELLE,
  )
  @IsInt()
  @Min(1)
  jourMois?: number;

  @ValidateIf((o) => o.type === TypeRecurrence.PRECISE)
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'heure doit être au format HH:mm',
  })
  heure?: string;

  // --- Champs utilisés si type = APPROXIMATIVE ---
  @ValidateIf((o) => o.type === TypeRecurrence.APPROXIMATIVE)
  @IsInt()
  @Min(1)
  intervalleEstime?: number;

  @ValidateIf((o) => o.type === TypeRecurrence.APPROXIMATIVE)
  @IsEnum(UniteTemps)
  uniteTemps?: UniteTemps;
}
