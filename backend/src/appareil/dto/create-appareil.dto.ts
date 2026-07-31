import { IsEnum, Matches } from 'class-validator';
import { Plateforme } from '../../../generated/prisma/enums.js';

export class CreateAppareilDto {
  @Matches(/^ExponentPushToken\[.+\]$/, {
    message: 'tokenPush doit être un token Expo valide',
  })
  tokenPush!: string;

  @IsEnum(Plateforme)
  plateforme!: Plateforme;
}
