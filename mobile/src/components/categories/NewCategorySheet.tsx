import { Folder } from "lucide-react-native";
import { CATEGORY_COLORS } from "../../constants/categoryColors";
import { useState } from "react";
import { useCreateCategorie } from "../../hooks/useCategories";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export const ICON_BY_INDEX = [Folder];

type CategoryColor = (typeof CATEGORY_COLORS)[number]["valeur"];

export function NewCategorySheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [nom, setNom] = useState("");
  const [couleur, setCouleur] = useState<CategoryColor>(
    CATEGORY_COLORS[0].valeur,
  );
  const createCategorie = useCreateCategorie();

  if (!visible) return null;

  async function handleCreate() {
    if (!nom.trim()) return;
    try {
      await createCategorie.mutateAsync({ nom: nom.trim(), couleur });
      setNom("");
      onClose();
    } catch (err: any) {
      Alert.alert(
        "Erreur",
        err.response?.data?.message ?? "Impossible de créer la catégorie",
      );
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      className="bg-black/60 justify-end"
    >
      <View className="flex-1 justify-end">
        <View className="bg-surface rounded-t-sheet px-5 pt-5 pb-7">
          <View className="w-9 h-1 rounded-full bg-card-border self-center mb-5" />
          <Text className="text-lg font-semibold text-text-primary mb-5">
            Nouvelle catégorie
          </Text>

          <Input
            label="Nom"
            placeholder="Ex. Mangas"
            value={nom}
            onChangeText={setNom}
            autoFocus
          />

          <Text className="text-xs text-text-secondary mb-2">Couleur</Text>
          <View className="flex-row flex-wrap gap-3 mb-6">
            {CATEGORY_COLORS.map((c) => (
              <TouchableOpacity
                key={c.valeur}
                onPress={() => setCouleur(c.valeur)}
                className="w-9 h-9 rounded-full items-center justify-center"
                style={{
                  backgroundColor: c.valeur,
                  borderWidth: couleur === c.valeur ? 2 : 0,
                  borderColor: "#F2F2F0",
                }}
              />
            ))}
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button label="Annuler" onPress={onClose} variant="secondary" />
            </View>
            <View className="flex-1">
              <Button
                label="Créer"
                onPress={handleCreate}
                variant="primary"
                isLoading={createCategorie.isPending}
              />
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
