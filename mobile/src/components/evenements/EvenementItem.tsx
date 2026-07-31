import { Text, View } from "react-native";
import { Evenement } from "../../api/evenements";
import { Card } from "../ui/Card";
import { Toggle } from "../ui/Toggle";
import { Clock, Repeat } from "lucide-react-native";
import { formatRecurrence } from "../../utils/formatRecurrence";

type EvenementItemProp = {
  evenement: Evenement;
  onToggle: (id: string, actif: boolean) => void;
  onLongPress?: () => void;
};

export function EvenementItem({
  evenement,
  onToggle,
  onLongPress,
}: EvenementItemProp) {
  const estPrecise = evenement.recurrence.type === "PRECISE";

  return (
    <Card className="mb-3" onLongPress={onLongPress} delayLongPress={400}>
      <View className="flex-row items-center justify-between mb-2.5">
        <Text className="text-[15px] text-text-primary flex-1">
          {evenement.titre}
        </Text>
        <Toggle
          value={evenement.actif}
          onValueChange={(v) => onToggle(evenement.id, v)}
        />
      </View>
      <View className="flex-row items-center gap-1.5">
        {estPrecise ? (
          <Clock size={13} color="#FF8562" />
        ) : (
          <Repeat size={13} color="#7A7A76" />
        )}
        <Text
          className={`text-xs ${estPrecise ? "text-accent-soft" : "text-text-secondary"}`}
        >
          {formatRecurrence(evenement)}
        </Text>
      </View>
    </Card>
  );
}
