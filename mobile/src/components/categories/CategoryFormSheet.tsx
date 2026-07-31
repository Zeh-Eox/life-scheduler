import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  useCreateCategorie,
  useUpdateCategorie,
} from "../../hooks/useCategories";
import { Categorie } from "../../api/categories";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { CATEGORY_COLORS } from "../../constants/categoryColors";

type CategorieFormSheetProps = {
  visible: boolean;
  onClose: () => void;
  categorie?: Categorie | null; // fourni = mode édition, absent/null = mode création
};

type CategoryColor = (typeof CATEGORY_COLORS)[number]["valeur"];

export function CategoryFormSheet({
  visible,
  onClose,
  categorie,
}: CategorieFormSheetProps) {
  const estEdition = !!categorie;

  const [nom, setNom] = useState("");
  const [couleur, setCouleur] = useState<CategoryColor>(
    CATEGORY_COLORS[0].valeur,
  );
  const [erreur, setErreur] = useState<string | null>(null);

  const createCategorie = useCreateCategorie();
  const updateCategorie = useUpdateCategorie();
  const isPending = createCategorie.isPending || updateCategorie.isPending;

  // Pré-remplit le formulaire à chaque ouverture en mode édition
  useEffect(() => {
    if (visible) {
      setNom(categorie?.nom ?? "");
      setCouleur(
        (categorie?.couleur as CategoryColor) ?? CATEGORY_COLORS[0].valeur,
      );
      setErreur(null);
    }
  }, [visible, categorie]);

  async function handleSubmit() {
    if (!nom.trim()) {
      setErreur("Le nom est requis");
      return;
    }
    setErreur(null);
    try {
      if (estEdition && categorie) {
        await updateCategorie.mutateAsync({
          id: categorie.id,
          input: { nom: nom.trim(), couleur },
        });
      } else {
        await createCategorie.mutateAsync({ nom: nom.trim(), couleur });
      }
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.message ?? "Une erreur est survenue";
      setErreur(Array.isArray(message) ? message[0] : message);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        className="bg-black/60 justify-end"
      >
        <View className="bg-surface rounded-t-sheet px-5 pt-5 pb-7">
          <View className="w-9 h-1 rounded-full bg-card-border self-center mb-5" />
          <Text className="text-lg font-semibold text-text-primary mb-5">
            {estEdition ? "Modifier la catégorie" : "Nouvelle catégorie"}
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

          {erreur && <Text className="text-danger text-sm mb-4">{erreur}</Text>}

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button label="Annuler" onPress={onClose} variant="secondary" />
            </View>
            <View className="flex-1">
              <Button
                label={estEdition ? "Enregistrer" : "Créer"}
                onPress={handleSubmit}
                variant="primary"
                isLoading={isPending}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
