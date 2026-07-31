import { View, Text, TouchableOpacity } from "react-native";
import { LucideIcon } from "lucide-react-native";

type CategoryTileProps = {
  nom: string;
  sousTitre: string;
  couleur: string;
  Icon: LucideIcon;
  onPress: () => void;
  onLongPress: () => void;
};

export function CategoryTile({
  nom,
  sousTitre,
  couleur,
  Icon,
  onPress,
  onLongPress,
}: CategoryTileProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-card border border-card-border rounded-card p-4"
      style={{ flexBasis: "48%" }}
      onLongPress={onLongPress}
      delayLongPress={400}
    >
      <View
        className="w-9 h-9 rounded-xl items-center justify-center mb-7"
        style={{ backgroundColor: couleur }}
      >
        <Icon size={16} color="#121212" />
      </View>
      <Text className="text-text-primary text-sm mb-0.5">{nom}</Text>
      <Text className="text-xs" style={{ color: couleur }}>
        {sousTitre}
      </Text>
    </TouchableOpacity>
  );
}
