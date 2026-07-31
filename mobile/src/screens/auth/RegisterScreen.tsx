import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Bell } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "../../navigation/types";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

export function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!nom.trim() || !email.trim() || !motDePasse) {
      setErreur("Tous les champs sont requis");
      return;
    }
    if (motDePasse.length < 8) {
      setErreur("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setErreur(null);
    setIsSubmitting(true);
    try {
      await register(nom.trim(), email.trim(), motDePasse);
    } catch (err: any) {
      const message =
        err.response?.data?.message ?? "Erreur lors de l'inscription";
      setErreur(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-12 h-12 rounded-2xl bg-accent items-center justify-center mb-8">
            <Bell size={22} color="#0A0A0A" />
          </View>

          <Text className="text-2xl font-semibold text-text-primary mb-1.5">
            Créer un compte
          </Text>
          <Text className="text-sm text-text-secondary mb-7">
            Rejoins pour centraliser tes rappels
          </Text>

          <Input
            label="Nom"
            placeholder="Ton nom"
            value={nom}
            onChangeText={setNom}
          />
          <Input
            label="Email"
            placeholder="email@exemple.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Mot de passe"
            placeholder="Au moins 8 caractères"
            isPassword
            value={motDePasse}
            onChangeText={setMotDePasse}
          />

          {erreur && <Text className="text-danger text-sm mb-4">{erreur}</Text>}

          <View className="mb-5">
            <Button
              label="S'inscrire"
              onPress={handleSubmit}
              variant="primary"
              isLoading={isSubmitting}
            />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-sm text-text-secondary text-center">
              Déjà un compte ? <Text className="text-accent">Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
