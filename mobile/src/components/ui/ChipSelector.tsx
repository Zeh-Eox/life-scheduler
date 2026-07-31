import { View, TouchableOpacity, Text } from "react-native";

type ChipSelectorProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function ChipSelector<T extends string>({
  options,
  value,
  onChange,
}: ChipSelectorProps<T>) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            className={`rounded-xl px-3 py-2.5 border ${
              isActive
                ? "bg-accent-tint border-accent"
                : "bg-card border-card-border"
            }`}
          >
            <Text
              className={`text-xs ${isActive ? "text-accent-soft font-semibold" : "text-text-secondary"}`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
