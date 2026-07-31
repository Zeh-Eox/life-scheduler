import { View, TouchableOpacity, Text } from "react-native";

type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View className="flex-row bg-card rounded-control p-1">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            className={`flex-1 rounded-control py-2.5 items-center ${
              isActive ? "bg-accent" : ""
            }`}
          >
            <Text
              className={`text-sm ${
                isActive ? "text-bg font-semibold" : "text-text-secondary"
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
