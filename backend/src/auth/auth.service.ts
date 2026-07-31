import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AppareilService } from '../appareil/appareil.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private appareilService: AppareilService,
  ) {}

  private async signTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: this.configService.getOrThrow<'15m'>(
            'JWT_ACCESS_EXPIRATION',
          ),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: this.configService.getOrThrow<'7d'>(
            'JWT_REFRESH_EXPIRATION',
          ),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.prisma.utilisateur.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ForbiddenException('Cet email est déjà utilisé.');
    }

    const hashedPassword = await argon2.hash(dto.motDePasse);
    const newUser = await this.prisma.utilisateur.create({
      data: {
        nom: dto.nom,
        email: dto.email,
        motDePasseHash: hashedPassword,
      },
    });
    const tokens = await this.signTokens(newUser.id, newUser.email);
    await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);

    return tokens;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    const passwordMatches = await argon2.verify(
      user.motDePasseHash,
      dto.motDePasse,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string, tokenPush?: string) {
    await this.prisma.utilisateur.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });

    if (tokenPush) {
      await this.appareilService.removeByToken(tokenPush, userId);
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
    });
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Accès refusé.');
    }

    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Accès refusé.');
    }

    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }
}
