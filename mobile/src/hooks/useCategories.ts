import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as categoriesApi from "../api/categories";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getCategories,
  });
}

export function useCreateCategorie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.createCategorie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategorie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: categoriesApi.UpdateCategorieInput;
    }) => categoriesApi.updateCategorie(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategorie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.deleteCategorie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
