import { apiClient } from "./client";

export type TypeRecurrence = "PRECISE" | "APPROXIMATIVE";
export type Frequence = "QUOTIDIENNE" | "HEBDOMADAIRE" | "MENSUELLE";
export type JourSemaine =
  | "LUNDI"
  | "MARDI"
  | "MERCREDI"
  | "JEUDI"
  | "VENDREDI"
  | "SAMEDI"
  | "DIMANCHE";
export type UniteTemps = "JOURS" | "SEMAINES" | "MOIS";

export type Recurrence = {
  id: string;
  type: TypeRecurrence;
  frequence: Frequence | null;
  jourSemaine: JourSemaine | null;
  jourMois: number | null;
  heure: string | null;
  intervalleEstime: number | null;
  uniteTemps: UniteTemps | null;
  prochainRappelEstime: string | null;
};

export type Evenement = {
  id: string;
  titre: string;
  description: string | null;
  actif: boolean;
  categorieId: string;
  recurrence: Recurrence;
};

export type CreateRecurrenceInput =
  | { type: "PRECISE"; frequence: "QUOTIDIENNE"; heure: string }
  | {
      type: "PRECISE";
      frequence: "HEBDOMADAIRE";
      jourSemaine: JourSemaine;
      heure: string;
    }
  | { type: "PRECISE"; frequence: "MENSUELLE"; jourMois: number; heure: string }
  | { type: "APPROXIMATIVE"; intervalleEstime: number; uniteTemps: UniteTemps };

export type CreateEvenementInput = {
  titre: string;
  description?: string;
  categorieId: string;
  recurrence: CreateRecurrenceInput;
};

export async function getEvenements(categorieId: string): Promise<Evenement[]> {
  const { data } = await apiClient.get("/evenements", {
    params: { categorieId },
  });
  return data;
}

export async function createEvenement(
  input: CreateEvenementInput,
): Promise<Evenement> {
  const { data } = await apiClient.post("/evenements", input);
  return data;
}

export async function deleteEvenement(id: string): Promise<void> {
  await apiClient.delete(`/evenements/${id}`);
}

export async function toggleEvenementActif(
  id: string,
  actif: boolean,
): Promise<Evenement> {
  const { data } = await apiClient.patch(`/evenements/${id}`, { actif });
  return data;
}
