import { Evenement } from "../api/evenements";

export function formatRecurrence(evenement: Evenement): string {
  const r = evenement.recurrence;
  if (r.type === "PRECISE") {
    if (r.frequence === "QUOTIDIENNE") return `Tous les jours à ${r.heure}`;
    if (r.frequence === "HEBDOMADAIRE")
      return `Chaque ${r.jourSemaine?.toLowerCase()} à ${r.heure}`;
    if (r.frequence === "MENSUELLE")
      return `Le ${r.jourMois} de chaque mois à ${r.heure}`;
  }
  if (r.type === "APPROXIMATIVE") {
    return `Environ tous les ${r.intervalleEstime} ${r.uniteTemps?.toLowerCase()}`;
  }
  return "";
}
