import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Sparkles,
  CalendarDays,
  AlertTriangle,
} from "lucide-react-native";
import { AppStackParamList } from "../../navigation/types";
import {
  useEvenements,
  useDeleteEvenement,
  useToggleEvenementActif,
} from "../../hooks/useEvenements";
import { Button } from "../../components/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { EvenementItem } from "../../components/evenements/EvenementItem";
import { NewEvenementSheet } from "../../components/evenements/NewEvenementSheet";
import { Evenement } from "../../api/evenements";
import { ActionsSheet } from "../../components/ui/ActionsSheet";
import { DeleteConfirmModal } from "../../components/ui/DeleteConfirmModal";

type EvenementsScreenRouteProp = RouteProp<AppStackParamList, "Evenements">;
type EvenementsScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "Evenements"
>;

export function EvenementsScreen() {
  const route = useRoute<EvenementsScreenRouteProp>();
  const navigation = useNavigation<EvenementsScreenNavigationProp>();
  const { categorieId, categorieNom } = route.params;

  const [selectedEvenement, setSelectedEvenement] = useState<Evenement | null>(
    null,
  );
  const [sheetVisible, setSheetVisible] = useState(false);
  const [evenementToDelete, setEvenementToDelete] = useState<Evenement | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: evenements,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useEvenements(categorieId);
  const deleteEvenement = useDeleteEvenement(categorieId);
  const toggleActif = useToggleEvenementActif(categorieId);

  const count = evenements?.length ?? 0;

  const handleOpenDeleteModal = () => {
    const evenement = selectedEvenement;
    setSelectedEvenement(null); // Ferme l'ActionsSheet
    setTimeout(() => {
      setEvenementToDelete(evenement); // Ouvre la modale après un très léger délai pour la fluidité
    }, 50);
  };

  const handleConfirmDelete = async () => {
    if (!evenementToDelete) return;

    setIsDeleting(true);
    try {
      await deleteEvenement.mutateAsync(evenementToDelete.id);
      setEvenementToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bg px-6">
        <ActivityIndicator size="large" color="#FF5A36" />
        <Text className="mt-4 text-xs font-medium text-text-secondary tracking-wide">
          Chargement des événements...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-bg">
        <View className="w-12 h-12 rounded-full bg-danger/10 items-center justify-center mb-3">
          <AlertTriangle size={20} color="#FF453A" />
        </View>
        <Text className="text-base font-semibold text-text-primary text-center mb-1">
          Impossible de charger les événements
        </Text>
        <Text className="text-xs text-text-secondary text-center mb-6">
          Une erreur est survenue lors de la récupération des données.
        </Text>
        <Button label="Réessayer" onPress={() => refetch()} variant="accent" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 px-5 pt-3">
        {/* Navigation Bar & Header */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              className="w-10 h-10 rounded-full bg-bg-card/80 items-center justify-center border border-gray-800 active:opacity-70"
            >
              <ArrowLeft size={18} color="#A1A1AA" />
            </TouchableOpacity>

            {/* Badge du compteur */}
            <View className="bg-bg-card/80 px-2.5 py-1 rounded-full border border-gray-800">
              <Text className="text-xs font-semibold text-text-secondary">
                {count} {count > 1 ? "événements" : "événement"}
              </Text>
            </View>
          </View>

          {/* Titre de la catégorie */}
          <Text className="text-2xl font-bold tracking-tight text-text-primary mb-1">
            {categorieNom}
          </Text>

          {/* Astuce visuelle */}
          {count > 0 && (
            <View className="flex-row items-center gap-1.5 mt-0.5">
              <Sparkles size={12} color="#9CA3AF" />
              <Text className="text-xs font-medium text-gray-400">
                Maintenez un événement pour afficher les options
              </Text>
            </View>
          )}
        </View>

        {/* Liste des événements */}
        <FlatList
          data={evenements}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            gap: 10,
            paddingBottom: 24,
            flexGrow: count === 0 ? 1 : undefined,
          }}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item }) => (
            <EvenementItem
              evenement={item}
              onToggle={(id, actif) => toggleActif.mutate({ id, actif })}
              onLongPress={() => setSelectedEvenement(item)}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12 px-4">
              <View className="w-16 h-16 rounded-2xl bg-gray-800/40 items-center justify-center mb-4 border border-gray-700/50">
                <CalendarDays size={28} color="#FF5A36" />
              </View>
              <Text className="text-base font-semibold text-text-primary text-center mb-1">
                Aucun événement
              </Text>
              <Text className="text-xs text-text-secondary text-center leading-relaxed max-w-[240px]">
                Il n'y a aucun événement enregistré dans "{categorieNom}" pour
                le moment.
              </Text>
            </View>
          }
        />

        {/* Bouton d'action fixe en bas */}
        <View className="py-4 bg-bg border-t border-gray-900">
          <Button
            label="Nouvel événement"
            onPress={() => setSheetVisible(true)}
            variant="primary"
          />
        </View>
      </View>

      {/* Sheets & Modales */}
      <NewEvenementSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        categorieId={categorieId}
      />

      <ActionsSheet
        visible={selectedEvenement !== null}
        categoryName={selectedEvenement?.titre ?? ""}
        onClose={() => setSelectedEvenement(null)}
        onEdit={() => {
          // Ouverture du formulaire d'édition
        }}
        onDelete={handleOpenDeleteModal}
      />

      <DeleteConfirmModal
        visible={evenementToDelete !== null}
        title="Supprimer l'événement"
        description={`Êtes-vous sûr de vouloir supprimer "${evenementToDelete?.titre}" ? Cette action est irréversible.`}
        isLoading={isDeleting}
        onCancel={() => setEvenementToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}
