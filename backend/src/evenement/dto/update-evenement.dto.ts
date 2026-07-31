import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateEvenementDto {
  @IsOptional()
  @IsString()
  titre?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
