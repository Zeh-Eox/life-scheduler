import { apiClient } from "./client";

export type Plateforme = "IOS" | "ANDROID";

export type Appareil = {
  id: string;
  tokenPush: string;
  plateforme: Plateforme;
};

export async function registerAppareil(
  tokenPush: string,
  plateforme: Plateforme,
): Promise<Appareil> {
  const { data } = await apiClient.post("/appareil", { tokenPush, plateforme });
  return data;
}

export async function getAppareils(): Promise<Appareil[]> {
  const { data } = await apiClient.get("/appareil");
  return data;
}

export async function deleteAppareil(id: string): Promise<void> {
  await apiClient.delete(`/appareil/${id}`);
}
