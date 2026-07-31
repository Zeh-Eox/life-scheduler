import { useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Sparkles, PlusCircle } from "lucide-react-native";
import { AppStackParamList } from "../../navigation/types";
import { useAuth } from "../../context/AuthContext";
import { useCategories, useDeleteCategorie } from "../../hooks/useCategories";
import { CategoryTile } from "../../components/ui/CategoryTile";
import { Button } from "../../components/ui/Button";
import {
  ICON_BY_INDEX,
  NewCategorySheet,
} from "../../components/categories/NewCategorySheet";
import { Categorie } from "../../api/categories";
import { ActionsSheet } from "../../components/ui/ActionsSheet";
import { CategoryFormSheet } from "../../components/categories/CategoryFormSheet";
import { DeleteConfirmModal } from "../../components/ui/DeleteConfirmModal";

type CategoriesScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "Categories"
>;

export function CategoriesScreen() {
  const navigation = useNavigation<CategoriesScreenNavigationProp>();
  const { logout } = useAuth();
  const {
    data: categories,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useCategories();
  const deleteCategorie = useDeleteCategorie();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [formSheetVisible, setFormSheetVisible] = useState(false);
  const [actionsSheetVisible, setActionsSheetVisible] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Categorie | null>(
    null,
  );
  const [categoryToDelete, setCategoryToDelete] = useState<Categorie | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  function ouvrirActions(categorie: Categorie) {
    setSelectedCategory(categorie);
    setActionsSheetVisible(true);
  }

  function ouvrirEdition() {
    setActionsSheetVisible(false);
    setFormSheetVisible(true);
  }

  function ouvrirCreation() {
    setSelectedCategory(null);
    setFormSheetVisible(true);
  }

  const handleOpenDeleteModal = () => {
    const category = selectedCategory;
    setSelectedCategory(null); // Ferme l'ActionsSheet
    setTimeout(() => {
      setCategoryToDelete(category); // Ouvre la modale après un très léger délai pour la fluidité
    }, 50);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await deleteCategorie.mutateAsync(categoryToDelete.id);
      setCategoryToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  function confirmerSuppression() {
    if (!selectedCategory) return;
    Alert.alert(
      "Supprimer la catégorie",
      `Êtes-vous sûr de vouloir supprimer "${selectedCategory.nom}" ?Cette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteCategorie.mutate(selectedCategory.id);
            setActionsSheetVisible(false);
          },
        },
      ],
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bg px-6">
        <ActivityIndicator size="large" color="#FF5A36" />
        <Text className="mt-4 text-xs font-medium text-text-secondary tracking-wide">
          Chargement de vos catégories...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-bg">
        <View className="w-12 h-12 rounded-full bg-danger/10 items-center justify-center mb-3">
          <Sparkles size={20} color="#FF453A" />
        </View>
        <Text className="text-base font-semibold text-text-primary text-center mb-1">
          Oups ! Une erreur est survenue
        </Text>
        <Text className="text-xs text-text-secondary text-center mb-6">
          Impossible de charger vos catégories pour le moment.
        </Text>
        <Button label="Réessayer" onPress={() => refetch()} variant="accent" />
      </View>
    );
  }

  const count = categories?.length ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-bg">
      {/* Container global pour gérer les paddings proprement */}
      <View className="flex-1 px-5 pt-3">
        {/* Header Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-2xl font-bold tracking-tight text-text-primary">
              Mes catégories
            </Text>

            {/* Badge élégant pour le compteur */}
            <View className="bg-bg-card/80 px-2.5 py-1 rounded-full border border-gray-800">
              <Text className="text-xs font-semibold text-text-secondary">
                {count} {count > 1 ? "actives" : "active"}
              </Text>
            </View>
          </View>

          {/* Astuce visuelle subtile et moderne */}
          <View className="flex-row items-center gap-1.5 mt-0.5">
            <Sparkles
              size={12}
              className="text-text-secondary"
              color="#9CA3AF"
            />
            <Text className="text-xs font-medium text-gray-400">
              Maintenez une catégorie pour la gérer
            </Text>
          </View>
        </View>

        {/* Grille des catégories */}
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{
            gap: 12,
            paddingBottom: 24,
            flexGrow: count === 0 ? 1 : undefined,
          }}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item, index }) => {
            const Icon = ICON_BY_INDEX[index % ICON_BY_INDEX.length];
            return (
              <CategoryTile
                nom={item.nom}
                sousTitre="Voir les événements"
                couleur={item.couleur ?? "#FF5A36"}
                Icon={Icon}
                onPress={() =>
                  navigation.navigate("Evenements", {
                    categorieId: item.id,
                    categorieNom: item.nom,
                  })
                }
                onLongPress={() => ouvrirActions(item)}
              />
            );
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12 px-4">
              <View className="w-16 h-16 rounded-2xl bg-gray-800/40 items-center justify-center mb-4 border border-gray-700/50">
                <PlusCircle size={28} color="#FF5A36" />
              </View>
              <Text className="text-base font-semibold text-text-primary text-center mb-1">
                Aucune catégorie
              </Text>
              <Text className="text-xs text-text-secondary text-center leading-relaxed max-w-[240px]">
                Créez votre première catégorie pour organiser vos événements.
              </Text>
            </View>
          }
        />

        {/* Action fixe en bas d'écran */}
        <View className="py-4 bg-bg border-t border-gray-900">
          <Button
            label="Nouvelle catégorie"
            onPress={() => setSheetVisible(true)}
            variant="primary"
          />
        </View>
      </View>

      {/* Sheets / Modales */}
      <NewCategorySheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
      />

      <ActionsSheet
        visible={actionsSheetVisible}
        categoryName={selectedCategory?.nom ?? ""}
        onEdit={ouvrirEdition}
        onClose={() => setActionsSheetVisible(false)}
        onDelete={handleOpenDeleteModal}
      />

      <DeleteConfirmModal
        visible={categoryToDelete !== null}
        title="Supprimer la catégorie"
        description={`Êtes-vous sûr de vouloir supprimer "${categoryToDelete?.nom}" ? Cette action est irréversible.`}
        isLoading={isDeleting}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <CategoryFormSheet
        visible={formSheetVisible}
        onClose={() => setFormSheetVisible(false)}
        categorie={selectedCategory}
      />
    </SafeAreaView>
  );
}
