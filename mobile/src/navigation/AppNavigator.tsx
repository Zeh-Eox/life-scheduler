import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppStackParamList } from "./types";
import { CategoriesScreen } from "../screens/app/CategoriesScreen";
import { EvenementsScreen } from "../screens/app/EvenementsScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: "Mes catégories" }}
      />
      <Stack.Screen
        name="Evenements"
        component={EvenementsScreen}
        options={({ route }) => ({ title: route.params.categorieNom })}
      />
    </Stack.Navigator>
  );
}
