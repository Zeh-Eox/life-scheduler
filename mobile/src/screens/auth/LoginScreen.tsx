import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Bell } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "../../navigation/types";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !motDePasse) {
      setErreur("Email et mot de passe requis");
      return;
    }

    setErreur(null);
    setIsSubmitting(true);
    try {
      await login(email.trim(), motDePasse);
    } catch (err: any) {
      const message = err.response?.data?.message ?? "Erreur de connexion";
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
            Bon retour
          </Text>

          <Text className="text-sm text-text-secondary mb-8">
            Connecte-toi pour continuer
          </Text>

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
            placeholder="········"
            isPassword
            value={motDePasse}
            onChangeText={setMotDePasse}
          />

          {erreur && <Text className="text-danger text-sm mb-4">{erreur}</Text>}

          <View className="mt-4 mb-5">
            <Button
              label="Se connecter"
              onPress={handleSubmit}
              variant="primary"
              isLoading={isSubmitting}
            />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text className="text-sm text-text-secondary text-center">
              Pas encore de compte ?{" "}
              <Text className="text-accent">S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
