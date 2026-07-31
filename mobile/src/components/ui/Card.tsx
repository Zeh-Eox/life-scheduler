import { View, TouchableOpacity, TouchableOpacityProps } from "react-native";

type CardProps = TouchableOpacityProps & {
  className?: string;
};

export function Card({
  className = "",
  onPress,
  onLongPress,
  ...props
}: CardProps) {
  const baseClassName = `bg-card border border-card-border rounded-card p-4 ${className}`;

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        onLongPress={onLongPress}
        className={baseClassName}
        {...props}
      />
    );
  }

  return <View className={baseClassName}>{props.children}</View>;
}
