import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

type InputProps = TextInputProps & {
  label: string;
  isPassword?: boolean;
};

export function Input({ label, isPassword, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-xs text-text-secondary mb-1.5">{label}</Text>
      <View className="flex-row items-center bg-card border border-card-border rounded-control px-4">
        <TextInput
          className="flex-1 py-3.5 text-text-primary text-sm"
          placeholderTextColor="#7A7A76"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            {showPassword ? (
              <EyeOff size={16} color="#7A7A76" />
            ) : (
              <Eye size={16} color="#7A7A76" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
