import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Pencil, Trash2, X } from "lucide-react-native";

type Props = {
  visible: boolean;
  categoryName: string;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export function ActionsSheet({
  visible,
  categoryName,
  onEdit,
  onDelete,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/60 justify-end"
      >
        <TouchableOpacity
          activeOpacity={1}
          className="bg-surface rounded-t-sheet px-5 pt-5 pb-7"
        >
          <View className="w-9 h-1 rounded-full bg-card-border self-center mb-5" />

          <Text className="text-lg font-semibold text-text-primary text-center">
            {categoryName}
          </Text>

          <Text className="text-sm text-text-secondary text-center mt-1 mb-6">
            Que souhaitez-vous faire ?
          </Text>

          <TouchableOpacity
            onPress={onEdit}
            activeOpacity={0.7}
            className="flex-row items-center py-4"
          >
            <Pencil size={20} color="#F2F2F0" />
            <Text className="ml-4 text-base text-text-primary">Modifier</Text>
          </TouchableOpacity>

          <View className="h-px bg-card-border" />

          <TouchableOpacity
            onPress={onDelete}
            activeOpacity={0.7}
            className="flex-row items-center py-4"
          >
            <Trash2 size={20} color="#F5766F" />
            <Text className="ml-4 text-base text-danger">Supprimer</Text>
          </TouchableOpacity>

          <View className="h-px bg-card-border" />

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="flex-row items-center justify-center py-4"
          >
            <X size={18} color="#7A7A76" />
            <Text className="ml-2 text-text-secondary">Annuler</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
