import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CategorieService } from '../categorie/categorie.service.js';
import { CreateEvenementDto } from './dto/create-evenement.dto.js';
import { UpdateEvenementDto } from './dto/update-evenement.dto.js';
import { UpdateRecurrenceDto } from './dto/update-recurrence.dto.js';
import { RecurrenceCalculatorService } from './recurrence-calculator.service.js';

@Injectable()
export class EvenementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categorieService: CategorieService,
    private recurrenceCalculator: RecurrenceCalculatorService,
  ) {}

  private async findOwnedOrThrow(id: string, userId: string) {
    const evenement = await this.prisma.evenement.findUnique({
      where: { id },
      include: { recurrence: true, categorie: true },
    });

    if (!evenement) throw new NotFoundException('Événement introuvable');
    if (evenement.categorie.utilisateurId !== userId) {
      throw new ForbiddenException('Cet événement ne vous appartient pas');
    }

    return evenement;
  }

  async create(userId: string, dto: CreateEvenementDto) {
    // Lève une exception si la catégorie n'existe pas ou n'appartient pas à l'utilisateur
    await this.categorieService.findOne(dto.categorieId, userId);

    const prochainRappelEstime =
      this.recurrenceCalculator.calculerProchaineOccurrence({
        ...dto.recurrence,
      } as any);

    return this.prisma.evenement.create({
      data: {
        titre: dto.titre,
        description: dto.description,
        categorieId: dto.categorieId,
        recurrence: {
          create: { ...dto.recurrence, prochainRappelEstime },
        },
      },
      include: {
        recurrence: true,
      },
    });
  }

  findAllForUser(userId: string, categorieId?: string) {
    return this.prisma.evenement.findMany({
      where: {
        categorie: { utilisateurId: userId },
        ...(categorieId ? { categorieId } : {}),
      },
      include: { recurrence: true },
      orderBy: { dateCreation: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.findOwnedOrThrow(id, userId);
  }

  async update(id: string, userId: string, dto: UpdateEvenementDto) {
    await this.findOwnedOrThrow(id, userId);
    return this.prisma.evenement.update({
      where: { id },
      data: dto,
      include: { recurrence: true },
    });
  }

  async updateRecurrence(id: string, userId: string, dto: UpdateRecurrenceDto) {
    const evenement = await this.findOwnedOrThrow(id, userId);
    const recurrenceMisAJour = { ...evenement.recurrence, ...dto } as any;
    const prochainRappelEstime =
      this.recurrenceCalculator.calculerProchaineOccurrence(recurrenceMisAJour);

    return this.prisma.recurrence.update({
      where: { evenementId: id },
      data: { ...dto, prochainRappelEstime },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOwnedOrThrow(id, userId);
    // La cascade Prisma supprime aussi la récurrence et les notifications liées
    await this.prisma.evenement.delete({ where: { id } });
    return { message: 'Événement supprimé' };
  }
}
