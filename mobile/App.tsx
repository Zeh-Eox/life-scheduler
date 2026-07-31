import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/api/queryClient";
import { AuthProvider } from "./src/context/AuthContext";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import {
  useFonts,
  JetBrainsMono_500Medium,
} from "@expo-google-fonts/jetbrains-mono";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";

export default function App() {
  const [fontsLoaded] = useFonts({ JetBrainsMono_500Medium });

  const navigationTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#0A0A0A",
      card: "#121212",
      border: "#262626",
      primary: "#FF5A36",
      text: "#F2F2F0",
    },
  };

  if (!fontsLoaded) return null; // ou un splash screen

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="light" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
