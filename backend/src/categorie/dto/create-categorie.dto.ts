import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateCategorieDto {
  @IsString()
  @MinLength(1)
  nom!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  couleur?: string;
}
