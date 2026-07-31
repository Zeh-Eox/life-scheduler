import { Injectable } from '@nestjs/common';
import { Frequence, JourSemaine, TypeRecurrence, UniteTemps } from '../../generated/prisma/enums.js';
import { Recurrence } from '../../generated/prisma/browser.js';

const JOURS_SEMAINE_INDEX: Record<JourSemaine, number> = {
  DIMANCHE: 0,
  LUNDI: 1,
  MARDI: 2,
  MERCREDI: 3,
  JEUDI: 4,
  VENDREDI: 5,
  SAMEDI: 6,
};

@Injectable()
export class RecurrenceCalculatorService {
  calculerProchaineOccurrence(
    recurrence: Recurrence,
    depuis: Date = new Date(),
  ): Date {
    return recurrence.type === TypeRecurrence.PRECISE
      ? this.calculerOccurrencePrecise(recurrence, depuis)
      : this.calculerOccurrenceApproximative(recurrence, depuis);
  }

  private calculerOccurrencePrecise(
    recurrence: Recurrence,
    depuis: Date,
  ): Date {
    const [heures, minutes] = (recurrence.heure ?? '00:00')
      .split(':')
      .map(Number);

    switch (recurrence.frequence) {
      case Frequence.QUOTIDIENNE: {
        const prochaine = new Date(depuis);
        prochaine.setHours(heures, minutes, 0, 0);
        if (prochaine <= depuis) prochaine.setDate(prochaine.getDate() + 1);
        return prochaine;
      }

      case Frequence.HEBDOMADAIRE: {
        if (!recurrence.jourSemaine) throw new Error('jourSemaine requis');
        const jourCible = JOURS_SEMAINE_INDEX[recurrence.jourSemaine];
        const prochaine = new Date(depuis);
        prochaine.setHours(heures, minutes, 0, 0);
        let diff = (jourCible - prochaine.getDay() + 7) % 7;
        if (diff === 0 && prochaine <= depuis) diff = 7;
        prochaine.setDate(prochaine.getDate() + diff);
        return prochaine;
      }

      case Frequence.MENSUELLE: {
        if (!recurrence.jourMois) throw new Error('jourMois requis');
        const prochaine = new Date(
          depuis.getFullYear(),
          depuis.getMonth(),
          recurrence.jourMois,
          heures,
          minutes,
          0,
          0,
        );
        if (prochaine <= depuis) prochaine.setMonth(prochaine.getMonth() + 1);
        return prochaine;
      }

      case Frequence.ANNUELLE:
        throw new Error(
          'ANNUELLE non supportée : il manque un champ mois sur Recurrence',
        );

      default:
        throw new Error(`Fréquence non gérée : ${recurrence.frequence}`);
    }
  }

  private calculerOccurrenceApproximative(
    recurrence: Recurrence,
    depuis: Date,
  ): Date {
    const base = recurrence.dateDernierRappel ?? depuis;
    const prochaine = new Date(base);
    const intervalle = recurrence.intervalleEstime ?? 1;

    switch (recurrence.uniteTemps) {
      case UniteTemps.JOURS:
        prochaine.setDate(prochaine.getDate() + intervalle);
        break;
      case UniteTemps.SEMAINES:
        prochaine.setDate(prochaine.getDate() + intervalle * 7);
        break;
      case UniteTemps.MOIS:
        prochaine.setMonth(prochaine.getMonth() + intervalle);
        break;
      default:
        throw new Error(`Unité non gérée : ${recurrence.uniteTemps}`);
    }
    return prochaine;
  }
}
