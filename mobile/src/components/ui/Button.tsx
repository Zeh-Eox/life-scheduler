import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "accent";
  isLoading?: boolean;
  disabled?: boolean;
};

const VARIANT_STYLES = {
  primary: "bg-text-primary",
  accent: "bg-accent",
  secondary: "border border-card-border",
};

const VARIANT_TEXT = {
  primary: "text-bg",
  accent: "text-bg",
  secondary: "text-text-primary",
};

export function Button({
  label,
  onPress,
  variant = "primary",
  isLoading,
  disabled,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      className={`rounded-control py-3.5 items-center justify-center ${VARIANT_STYLES[variant]} ${
        disabled ? "opacity-40" : ""
      }`}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "secondary" ? "#F2F2F0" : "#0A0A0A"}
        />
      ) : (
        <Text className={`text-sm font-semibold ${VARIANT_TEXT[variant]}`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
