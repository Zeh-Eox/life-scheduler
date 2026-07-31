import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { registerAppareil } from "../api/appareils";

// Comportement d'affichage quand une notif arrive alors que l'app est au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Expo Go (SDK 53+) ne supporte plus les push notifications distantes sur Android.
// On désactive l'enregistrement dans ce cas précis plutôt que de laisser planter l'app.
const estExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export function usePushNotifications(isAuthenticated: boolean) {
  useEffect(() => {
    if (!isAuthenticated) return;

    if (estExpoGo) {
      console.log(
        "Push notifications désactivées : environnement Expo Go détecté",
      );
      return;
    }

    async function enregistrerToken() {
      if (!Device.isDevice) {
        console.warn("Les notifications push nécessitent un appareil physique");
        return;
      }

      const { status: statutExistant } =
        await Notifications.getPermissionsAsync();
      let statutFinal = statutExistant;

      if (statutExistant !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        statutFinal = status;
      }

      if (statutFinal !== "granted") {
        console.warn("Permission de notification refusée");
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      const { data: tokenPush } = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined,
      );

      try {
        await registerAppareil(
          tokenPush,
          Platform.OS === "ios" ? "IOS" : "ANDROID",
        );
      } catch (err) {
        console.warn("Échec de l'enregistrement du token push", err);
      }
    }

    enregistrerToken();
  }, [isAuthenticated]);
}
