import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategorieDto } from './dto/create-categorie.dto.js';
import { UpdateCategorieDto } from './dto/update-categorie.dto.js';

@Injectable()
export class CategorieService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOwnedOrThrow(id: string, userId: string) {
    const categorie = await this.prisma.categorie.findUnique({
      where: { id },
    });

    if (!categorie) throw new NotFoundException('Catégorie introuvable');

    if (categorie.utilisateurId !== userId) {
      throw new ForbiddenException('Cette catégorie ne vous appartient pas');
    }

    return categorie;
  }

  create(userId: string, dto: CreateCategorieDto) {
    return this.prisma.categorie.create({
      data: { ...dto, utilisateurId: userId },
    });
  }

  findAllForUser(userId: string) {
    return this.prisma.categorie.findMany({
      where: { utilisateurId: userId },
      orderBy: { dateCreation: 'desc' },
    });
  }

  findOne(id: string, userId: string) {
    return this.findOwnedOrThrow(id, userId);
  }

  async update(id: string, userId: string, dto: UpdateCategorieDto) {
    await this.findOwnedOrThrow(id, userId);
    return this.prisma.categorie.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOwnedOrThrow(id, userId);
    await this.prisma.categorie.delete({ where: { id } });
    return { message: 'Catégorie supprimée' };
  }
}
