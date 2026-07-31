import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as evenementsApi from "../api/evenements";

export function useEvenements(categorieId: string) {
  return useQuery({
    queryKey: ["evenements", categorieId],
    queryFn: () => evenementsApi.getEvenements(categorieId),
  });
}

export function useCreateEvenement(categorieId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: evenementsApi.createEvenement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evenements", categorieId] });
    },
  });
}

export function useDeleteEvenement(categorieId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: evenementsApi.deleteEvenement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evenements", categorieId] });
    },
  });
}

export function useToggleEvenementActif(categorieId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, actif }: { id: string; actif: boolean }) =>
      evenementsApi.toggleEvenementActif(id, actif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evenements", categorieId] });
    },
  });
}
