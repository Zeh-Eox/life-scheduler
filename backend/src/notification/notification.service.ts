import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { PrismaService } from '../prisma/prisma.service.js';
import { StatutNotification } from '../../generated/prisma/enums.js';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly expo = new Expo();

  constructor(private prisma: PrismaService) {}

  async creerEtEnvoyer(
    evenementId: string,
    titre: string,
    dateEnvoiPrevue: Date,
    tokens: string[],
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        evenementId,
        dateEnvoiPrevue,
        message: titre,
        statut: StatutNotification.EN_ATTENTE,
      },
    });

    try {
      await this.envoyerPush(tokens, titre);
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          statut: StatutNotification.ENVOYEE,
          dateEnvoiReelle: new Date(),
        },
      });
    } catch (err) {
      this.logger.error(`Échec envoi notification ${notification.id}`, err);
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: { statut: StatutNotification.ECHOUEE },
      });
    }
  }

  private async envoyerPush(tokens: string[], message: string) {
    const tokensValides = tokens.filter((t) => Expo.isExpoPushToken(t));
    if (tokensValides.length === 0) return;

    const messages: ExpoPushMessage[] = tokensValides.map((to) => ({
      to,
      sound: 'default',
      title: 'Rappel',
      body: message,
    }));

    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    this.logger.log(`Tickets Expo: ${JSON.stringify(tickets)}`); // temporaire, pour debug

    // Un ticket "error" avec DeviceNotRegistered signale un token mort à nettoyer
    const tokensMorts: string[] = [];
    tickets.forEach((ticket, i) => {
      if (
        ticket.status === 'error' &&
        ticket.details?.error === 'DeviceNotRegistered'
      ) {
        tokensMorts.push(tokensValides[i]);
      }
    });

    if (tokensMorts.length > 0) {
      await this.prisma.appareil.deleteMany({
        where: { tokenPush: { in: tokensMorts } },
      });
      this.logger.warn(
        `${tokensMorts.length} token(s) push invalide(s) supprimé(s)`,
      );
    }
  }
}
