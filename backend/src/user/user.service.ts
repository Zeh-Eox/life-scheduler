import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private toPublicUser(utilisateur: any) {
    const { motDePasseHash, hashedRefreshToken, ...publicUser } = utilisateur;
    return publicUser;
  }

  async findById(id: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id },
    });

    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable');

    return this.toPublicUser(utilisateur);
  }

  async update(id: string, dto: UpdateUserDto) {
    if (dto.email) {
      const existingUser = await this.prisma.utilisateur.findUnique({
        where: { email: dto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    const utilisateur = await this.prisma.utilisateur.update({
      where: { id },
      data: dto,
    });

    return this.toPublicUser(utilisateur);
  }

  async remove(id: string) {
    await this.prisma.utilisateur.delete({ where: { id } });

    return { message: 'Compte supprimé' };
  }
}
