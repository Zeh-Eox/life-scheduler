import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAppareilDto } from './dto/create-appareil.dto.js';

@Injectable()
export class AppareilService {
  constructor(private prisma: PrismaService) {}

  async register(userId: string, dto: CreateAppareilDto) {
    return this.prisma.appareil.upsert({
      where: { tokenPush: dto.tokenPush },
      create: {
        tokenPush: dto.tokenPush,
        plateforme: dto.plateforme,
        utilisateurId: userId,
      },
      update: {
        // Rattache le token à l'utilisateur courant, même s'il appartenait avant à quelqu'un d'autre
        utilisateurId: userId,
        plateforme: dto.plateforme,
      },
    });
  }

  findAllForUser(userId: string) {
    return this.prisma.appareil.findMany({ where: { utilisateurId: userId } });
  }

  async remove(id: string, userId: string) {
    const appareil = await this.prisma.appareil.findUnique({ where: { id } });
    if (!appareil) throw new NotFoundException('Appareil introuvable');
    if (appareil.utilisateurId !== userId) {
      throw new ForbiddenException('Cet appareil ne vous appartient pas');
    }
    await this.prisma.appareil.delete({ where: { id } });
    return { message: 'Appareil désenregistré' };
  }

  async removeByToken(tokenPush: string, userId: string) {
    const appareil = await this.prisma.appareil.findUnique({
      where: { tokenPush },
    });
    if (!appareil || appareil.utilisateurId !== userId) {
      return { message: 'Appareil désenregistré' }; // idempotent, pas d'erreur si déjà absent
    }
    await this.prisma.appareil.delete({ where: { tokenPush } });
    return { message: 'Appareil désenregistré' };
  }
}
