import { apiClient } from "./client";

export type Categorie = {
  id: string;
  nom: string;
  description: string | null;
  couleur: string | null;
  dateCreation: string;
};

export type CreateCategorieInput = {
  nom: string;
  description?: string;
  couleur?: string;
};

export type UpdateCategorieInput = {
  nom?: string;
  description?: string;
  couleur?: string;
};

export async function getCategories(): Promise<Categorie[]> {
  const { data } = await apiClient.get("/categories");
  return data;
}

export async function createCategorie(
  input: CreateCategorieInput,
): Promise<Categorie> {
  const { data } = await apiClient.post("/categories", input);
  return data;
}

export async function updateCategorie(
  id: string,
  input: UpdateCategorieInput,
): Promise<Categorie> {
  const { data } = await apiClient.patch(`/categories/${id}`, input);
  return data;
}

export async function deleteCategorie(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
