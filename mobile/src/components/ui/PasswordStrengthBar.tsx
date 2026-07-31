import { View } from "react-native";

export function PasswordStrengthBar({ motDePasse }: { motDePasse: string }) {
  // Décoratif pour l'instant — un vrai calcul de force pourra remplacer ce simple seuil de longueur
  const niveau =
    motDePasse.length === 0
      ? 0
      : motDePasse.length < 6
        ? 1
        : motDePasse.length < 10
          ? 2
          : 3;

  return (
    <View className="flex-row gap-1 mb-7">
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          className="flex-1 h-[3px] rounded-full"
          style={{ backgroundColor: i < niveau ? "#C8FF4D" : "#262626" }}
        />
      ))}
    </View>
  );
}
