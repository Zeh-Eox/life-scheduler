import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Trash2 } from "lucide-react-native";

interface DeleteConfirmModalProps {
  visible: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  visible,
  title,
  description,
  onCancel,
  onConfirm,
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* Backdrop sombre */}
      <View className="flex-1 justify-center items-center bg-black/60 px-5">
        {/* Carte de la modale */}
        <View className="w-full bg-[#1C1C1E] border border-gray-800 rounded-3xl p-6 items-center shadow-lg">
          {/* Icône */}
          <View className="w-14 h-14 rounded-full bg-[#FF453A]/10 items-center justify-center mb-4">
            <Trash2 size={24} color="#FF453A" />
          </View>

          {/* Textes */}
          <Text className="text-xl font-bold text-white text-center mb-2">
            {title}
          </Text>
          <Text className="text-sm text-gray-400 text-center mb-8 px-2">
            {description}
          </Text>

          {/* Boutons d'action */}
          <View className="w-full flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              disabled={isLoading}
              className="flex-1 py-3.5 rounded-xl bg-gray-800 items-center justify-center active:opacity-70"
            >
              <Text className="text-white font-semibold">Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={isLoading}
              className="flex-1 py-3.5 rounded-xl bg-[#FF453A] items-center justify-center active:opacity-70"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white font-semibold">Supprimer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
