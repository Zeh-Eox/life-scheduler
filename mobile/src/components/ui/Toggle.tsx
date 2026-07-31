import { Switch } from "react-native";

export function Toggle({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#262626", true: "#FF5A36" }}
      thumbColor={value ? "#F2F2F0" : "#7A7A76"}
    />
  );
}
