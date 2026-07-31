import { useState } from "react";
import { CreateRecurrenceInput, Frequence, JourSemaine, TypeRecurrence, UniteTemps } from "../../api/evenements";
import { useCreateEvenement } from "../../hooks/useEvenements";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, View, Text } from "react-native";
import { Input } from "../ui/Input";
import { SegmentedControl } from "../ui/SegmentedControl";
import { ChipSelector } from "../ui/ChipSelector";
import { Button } from "../ui/Button";


const JOURS: { value: JourSemaine; label: string }[] = [
  { value: "LUNDI", label: "Lu" },
  { value: "MARDI", label: "Ma" },
  { value: "MERCREDI", label: "Me" },
  { value: "JEUDI", label: "Je" },
  { value: "VENDREDI", label: "Ve" },
  { value: "SAMEDI", label: "Sa" },
  { value: "DIMANCHE", label: "Di" },
];
const FREQUENCES: { value: Frequence; label: string }[] = [
  { value: "QUOTIDIENNE", label: "Quotidien" },
  { value: "HEBDOMADAIRE", label: "Hebdo" },
  { value: "MENSUELLE", label: "Mensuel" },
]; // ANNUELLE volontairement exclue — non supportée par le calculateur backend
const UNITES: { value: UniteTemps; label: string }[] = [
  { value: "JOURS", label: "Jours" },
  { value: "SEMAINES", label: "Semaines" },
  { value: "MOIS", label: "Mois" },
];

export function NewEvenementSheet({
  visible,
  onClose,
  categorieId,
}: {
  visible: boolean;
  onClose: () => void;
  categorieId: string;
}) {
  const [titre, setTitre] = useState("");
  const [type, setType] = useState<TypeRecurrence>("PRECISE");
  const [frequence, setFrequence] = useState<Frequence>("HEBDOMADAIRE");
  const [jourSemaine, setJourSemaine] = useState<JourSemaine>("SAMEDI");
  const [jourMois, setJourMois] = useState("1");
  const [heure, setHeure] = useState("15:00");
  const [intervalleEstime, setIntervalleEstime] = useState("1");
  const [uniteTemps, setUniteTemps] = useState<UniteTemps>("MOIS");
  const [erreur, setErreur] = useState<string | null>(null);

  const createEvenement = useCreateEvenement(categorieId);

  function buildRecurrence(): CreateRecurrenceInput {
    if (type === "APPROXIMATIVE") {
      return {
        type: "APPROXIMATIVE",
        intervalleEstime: Number(intervalleEstime),
        uniteTemps,
      };
    }
    if (frequence === "QUOTIDIENNE")
      return { type: "PRECISE", frequence: "QUOTIDIENNE", heure };
    if (frequence === "HEBDOMADAIRE")
      return { type: "PRECISE", frequence: "HEBDOMADAIRE", jourSemaine, heure };
    return {
      type: "PRECISE",
      frequence: "MENSUELLE",
      jourMois: Number(jourMois),
      heure,
    };
  }

  async function handleCreate() {
    if (!titre.trim()) {
      setErreur("Le titre est requis");
      return;
    }
    setErreur(null);
    try {
      await createEvenement.mutateAsync({
        titre: titre.trim(),
        categorieId,
        recurrence: buildRecurrence(),
      });
      setTitre("");
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.message ?? "Impossible de créer l'événement";
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
        <ScrollView
          className="bg-surface rounded-t-sheet px-5 pt-5"
          contentContainerStyle={{ paddingBottom: 28 }}
          style={{ maxHeight: "88%" }}
        >
          <View className="w-9 h-1 rounded-full bg-card-border self-center mb-5" />
          <Text className="text-lg font-semibold text-text-primary mb-5">
            Nouvel événement
          </Text>

          <Input
            label="Titre"
            placeholder="Ex. Sortie chapitre One Piece"
            value={titre}
            onChangeText={setTitre}
          />

          <Text className="text-xs text-text-secondary mb-2">
            Type de rappel
          </Text>
          <View className="mb-5">
            <SegmentedControl
              options={[
                { value: "PRECISE", label: "Date précise" },
                { value: "APPROXIMATIVE", label: "Approximatif" },
              ]}
              value={type}
              onChange={setType}
            />
          </View>

          {type === "PRECISE" && (
            <>
              <Text className="text-xs text-text-secondary mb-2">
                Fréquence
              </Text>
              <View className="mb-5">
                <ChipSelector
                  options={FREQUENCES}
                  value={frequence}
                  onChange={setFrequence}
                />
              </View>

              {frequence === "HEBDOMADAIRE" && (
                <>
                  <Text className="text-xs text-text-secondary mb-2">
                    Jour de la semaine
                  </Text>
                  <View className="mb-5">
                    <ChipSelector
                      options={JOURS}
                      value={jourSemaine}
                      onChange={setJourSemaine}
                    />
                  </View>
                </>
              )}

              {frequence === "MENSUELLE" && (
                <Input
                  label="Jour du mois (1-31)"
                  keyboardType="number-pad"
                  value={jourMois}
                  onChangeText={setJourMois}
                />
              )}

              <Input
                label="Heure (HH:mm)"
                placeholder="15:00"
                value={heure}
                onChangeText={setHeure}
              />
            </>
          )}

          {type === "APPROXIMATIVE" && (
            <>
              <Input
                label="Intervalle estimé"
                keyboardType="number-pad"
                value={intervalleEstime}
                onChangeText={setIntervalleEstime}
              />
              <Text className="text-xs text-text-secondary mb-2">Unité</Text>
              <View className="mb-5">
                <ChipSelector
                  options={UNITES}
                  value={uniteTemps}
                  onChange={setUniteTemps}
                />
              </View>
            </>
          )}

          {erreur && <Text className="text-danger text-sm mb-4">{erreur}</Text>}

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button label="Annuler" onPress={onClose} variant="secondary" />
            </View>
            <View className="flex-1">
              <Button
                label="Créer"
                onPress={handleCreate}
                variant="primary"
                isLoading={createEvenement.isPending}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
