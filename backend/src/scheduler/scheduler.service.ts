import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationService } from '../notification/notification.service.js';
import { RecurrenceCalculatorService } from '../evenement/recurrence-calculator.service.js';
import { TypeRecurrence } from '../../generated/prisma/enums.js';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private recurrenceCalculator: RecurrenceCalculatorService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async traiterRappelsDus() {
    const maintenant = new Date();

    const recurrencesDues = await this.prisma.recurrence.findMany({
      where: {
        prochainRappelEstime: { lte: maintenant },
        evenement: { actif: true },
      },
      include: {
        evenement: {
          include: {
            categorie: {
              include: { utilisateur: { include: { appareils: true } } },
            },
          },
        },
      },
    });

    for (const recurrence of recurrencesDues) {
      const { evenement } = recurrence;
      const tokens = evenement.categorie.utilisateur.appareils.map(
        (a) => a.tokenPush,
      );

      await this.notificationService.creerEtEnvoyer(
        evenement.id,
        evenement.titre,
        recurrence.prochainRappelEstime!,
        tokens,
      );

      const donneesMiseAJour: any = {};
      if (recurrence.type === TypeRecurrence.APPROXIMATIVE) {
        donneesMiseAJour.dateDernierRappel = maintenant;
      }

      // Recalcule en boucle jusqu'à obtenir une date future — rattrape les cycles manqués
      // en un seul envoi plutôt que d'en accumuler un par jour de coupure serveur
      let prochaine = this.recurrenceCalculator.calculerProchaineOccurrence(
        { ...recurrence, ...donneesMiseAJour },
        maintenant,
      );
      let iterations = 0;
      while (prochaine <= maintenant && iterations < 1000) {
        prochaine = this.recurrenceCalculator.calculerProchaineOccurrence(
          {
            ...recurrence,
            ...donneesMiseAJour,
            prochainRappelEstime: prochaine,
          },
          prochaine,
        );
        iterations++;
      }
      donneesMiseAJour.prochainRappelEstime = prochaine;

      await this.prisma.recurrence.update({
        where: { id: recurrence.id },
        data: donneesMiseAJour,
      });
    }

    if (recurrencesDues.length > 0) {
      this.logger.log(`${recurrencesDues.length} rappel(s) traité(s)`);
    }
  }
}
